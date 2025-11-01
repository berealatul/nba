<?php

/**
 * MarksController
 * Handles marks submission and retrieval
 */
class MarksController
{
    private $studentRepository;
    private $rawMarksRepository;
    private $marksRepository;
    private $questionRepository;
    private $testRepository;
    private $validationMiddleware;

    public function __construct(
        StudentRepository $studentRepository,
        RawMarksRepository $rawMarksRepository,
        MarksRepository $marksRepository,
        QuestionRepository $questionRepository,
        TestRepository $testRepository,
        ValidationMiddleware $validationMiddleware
    ) {
        $this->studentRepository = $studentRepository;
        $this->rawMarksRepository = $rawMarksRepository;
        $this->marksRepository = $marksRepository;
        $this->questionRepository = $questionRepository;
        $this->testRepository = $testRepository;
        $this->validationMiddleware = $validationMiddleware;
    }

    /**
     * Send error response
     */
    private function sendError($message, $code = 400)
    {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
    }

    /**
     * Save marks per question (auto-calculates CO totals)
     * POST /marks/by-question
     * Body: {
     *   test_id: 1,
     *   student_id: "CS101",
     *   marks: [
     *     {question_identifier: "1", marks: 5},
     *     {question_identifier: "2a", marks: 3},
     *     {question_identifier: "2b", marks: 2.5}
     *   ]
     * }
     */
    public function saveMarksByQuestion()
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            // Validate required fields
            $required = ['test_id', 'student_id', 'marks'];
            foreach ($required as $field) {
                if (!isset($data[$field])) {
                    $this->sendError("Missing required field: $field", 400);
                    return;
                }
            }

            $testId = $data['test_id'];
            $studentId = $data['student_id'];
            $marksData = $data['marks'];

            // Validate test exists
            $test = $this->testRepository->findById($testId);
            if (!$test) {
                $this->sendError("Test not found", 404);
                return;
            }

            // Validate student exists
            if (!$this->studentRepository->exists($studentId)) {
                $this->sendError("Student not found", 404);
                return;
            }

            // Get all questions for this test
            $questions = $this->questionRepository->findByTestId($testId);
            $questionMap = [];
            foreach ($questions as $question) {
                $identifier = $question->getQuestionIdentifier();
                $questionMap[$identifier] = $question;
            }

            // Validate and prepare raw marks
            $rawMarksArray = [];
            foreach ($marksData as $markEntry) {
                if (!isset($markEntry['question_identifier']) || !isset($markEntry['marks'])) {
                    $this->sendError("Invalid marks entry format", 400);
                    return;
                }

                $identifier = $markEntry['question_identifier'];
                $marks = $markEntry['marks'];

                // Check if question exists
                if (!isset($questionMap[$identifier])) {
                    $this->sendError("Question '$identifier' not found in test", 404);
                    return;
                }

                $question = $questionMap[$identifier];

                // Validate marks <= max_marks
                if ($marks > $question->getMaxMarks()) {
                    $this->sendError(
                        "Marks for question '$identifier' exceed maximum ({$question->getMaxMarks()})",
                        400
                    );
                    return;
                }

                // Validate marks >= 0
                if ($marks < 0) {
                    $this->sendError("Marks cannot be negative", 400);
                    return;
                }

                $rawMarksArray[] = new RawMarks($testId, $studentId, $question->getId(), $marks);
            }

            // Save raw marks and calculate CO totals
            $this->rawMarksRepository->saveMultiple($rawMarksArray);
            $coTotals = $this->rawMarksRepository->calculateCOTotals($testId, $studentId);

            // Save aggregated marks
            $marks = new Marks(
                $studentId,
                $testId,
                $coTotals['CO1'],
                $coTotals['CO2'],
                $coTotals['CO3'],
                $coTotals['CO4'],
                $coTotals['CO5'],
                $coTotals['CO6']
            );
            $this->marksRepository->save($marks);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Marks saved successfully',
                'data' => [
                    'student_id' => $studentId,
                    'test_id' => $testId,
                    'co_totals' => $coTotals
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to save marks: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Save marks directly by CO (manual entry, no raw marks stored)
     * POST /marks/by-co
     * Body: {
     *   test_id: 1,
     *   student_id: "CS101",
     *   CO1: 10,
     *   CO2: 8.5,
     *   CO3: 15,
     *   CO4: 0,
     *   CO5: 0,
     *   CO6: 0
     * }
     */
    public function saveMarksByCO()
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            // Validate required fields
            $required = ['test_id', 'student_id'];
            foreach ($required as $field) {
                if (!isset($data[$field])) {
                    $this->sendError("Missing required field: $field", 400);
                    return;
                }
            }

            $testId = $data['test_id'];
            $studentId = $data['student_id'];

            // Validate test exists
            $test = $this->testRepository->findById($testId);
            if (!$test) {
                $this->sendError("Test not found", 404);
                return;
            }

            // Validate student exists
            if (!$this->studentRepository->exists($studentId)) {
                $this->sendError("Student not found", 404);
                return;
            }

            // Extract CO marks (default to 0 if not provided)
            $CO1 = isset($data['CO1']) ? $data['CO1'] : 0;
            $CO2 = isset($data['CO2']) ? $data['CO2'] : 0;
            $CO3 = isset($data['CO3']) ? $data['CO3'] : 0;
            $CO4 = isset($data['CO4']) ? $data['CO4'] : 0;
            $CO5 = isset($data['CO5']) ? $data['CO5'] : 0;
            $CO6 = isset($data['CO6']) ? $data['CO6'] : 0;

            // Validate all CO marks are non-negative
            $coValues = [$CO1, $CO2, $CO3, $CO4, $CO5, $CO6];
            foreach ($coValues as $coValue) {
                if ($coValue < 0) {
                    $this->sendError("CO marks cannot be negative", 400);
                    return;
                }
            }

            // Save marks
            $marks = new Marks($studentId, $testId, $CO1, $CO2, $CO3, $CO4, $CO5, $CO6);
            $this->marksRepository->save($marks);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Marks saved successfully',
                'data' => $marks->toArray()
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to save marks: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Get marks for a student in a test
     * GET /marks?test_id=1&student_id=CS101
     */
    public function getMarks()
    {
        try {
            $testId = isset($_GET['test_id']) ? $_GET['test_id'] : null;
            $studentId = isset($_GET['student_id']) ? $_GET['student_id'] : null;

            if (!$testId || !$studentId) {
                $this->sendError("Missing test_id or student_id parameter", 400);
                return;
            }

            // Get aggregated marks
            $marks = $this->marksRepository->findByTestAndStudent($testId, $studentId);

            // Get raw marks (per question)
            $rawMarks = $this->rawMarksRepository->findByTestAndStudent($testId, $studentId);

            $response = [
                'success' => true,
                'data' => [
                    'marks' => $marks ? $marks->toArray() : null,
                    'raw_marks' => array_map(function ($item) {
                        $questionIdentifier = $item['question_number'];
                        if ($item['sub_question']) {
                            $questionIdentifier .= $item['sub_question'];
                        }
                        return [
                            'question_identifier' => $questionIdentifier,
                            'marks' => $item['raw_marks']->getMarks(),
                            'co' => $item['co']
                        ];
                    }, $rawMarks)
                ]
            ];

            http_response_code(200);
            echo json_encode($response);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to retrieve marks: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Get all marks for a test
     * GET /marks/test/{test_id}
     */
    public function getTestMarks()
    {
        try {
            $testId = isset($_GET['test_id']) ? $_GET['test_id'] : null;

            if (!$testId) {
                $this->sendError("Missing test_id parameter", 400);
                return;
            }

            // Validate test exists
            $test = $this->testRepository->findById($testId);
            if (!$test) {
                $this->sendError("Test not found", 404);
                return;
            }

            $marksList = $this->marksRepository->findByTest($testId);

            $response = [
                'success' => true,
                'data' => [
                    'test' => $test->toArray(),
                    'marks' => array_map(function ($item) {
                        return [
                            'student_id' => $item['marks']->getStudentId(),
                            'student_name' => $item['student_name'],
                            'CO1' => $item['marks']->getCO1(),
                            'CO2' => $item['marks']->getCO2(),
                            'CO3' => $item['marks']->getCO3(),
                            'CO4' => $item['marks']->getCO4(),
                            'CO5' => $item['marks']->getCO5(),
                            'CO6' => $item['marks']->getCO6()
                        ];
                    }, $marksList)
                ]
            ];

            http_response_code(200);
            echo json_encode($response);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to retrieve test marks: ' . $e->getMessage()
            ]);
        }
    }
}
