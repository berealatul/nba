<?php

/**
 * Test Model
 * Represents a test/assessment entity
 */
class Test
{
    private $id;
    private $courseId;
    private $name;
    private $fullMarks;
    private $passMarks;
    private $questionPaperPdf;
    private $courseCode; // For filename generation
    private $year; // For filename generation
    private $semester; // For filename generation

    public function __construct($id, $courseId, $name, $fullMarks, $passMarks, $questionPaperPdf = null, $courseCode = null, $year = null, $semester = null)
    {
        $this->id = $id;
        $this->setCourseId($courseId);
        $this->setName($name);
        $this->setFullMarks($fullMarks);
        $this->setPassMarks($passMarks);
        $this->questionPaperPdf = $questionPaperPdf;
        $this->courseCode = $courseCode;
        $this->year = $year;
        $this->semester = $semester;
    }

    // Getters
    public function getId()
    {
        return $this->id;
    }
    public function getCourseId()
    {
        return $this->courseId;
    }
    public function getName()
    {
        return $this->name;
    }
    public function getFullMarks()
    {
        return $this->fullMarks;
    }
    public function getPassMarks()
    {
        return $this->passMarks;
    }
    public function getQuestionPaperPdf()
    {
        return $this->questionPaperPdf;
    }

    // Setters with validation
    public function setId($id)
    {
        $this->id = $id;
    }

    public function setCourseId($courseId)
    {
        if (!is_numeric($courseId)) {
            throw new Exception("Course ID must be a number");
        }
        $this->courseId = (int)$courseId;
    }

    public function setName($name)
    {
        if (empty($name) || strlen($name) > 255) {
            throw new Exception("Test name must be between 1 and 255 characters");
        }
        $this->name = $name;
    }

    public function setFullMarks($fullMarks)
    {
        if (!is_numeric($fullMarks) || $fullMarks <= 0) {
            throw new Exception("Full marks must be greater than 0");
        }
        $this->fullMarks = (int)$fullMarks;
    }

    public function setPassMarks($passMarks)
    {
        if (!is_numeric($passMarks) || $passMarks < 0) {
            throw new Exception("Pass marks must be a non-negative number");
        }
        $this->passMarks = (int)$passMarks;
    }

    public function setQuestionPaperPdf($questionPaperPdf)
    {
        $this->questionPaperPdf = $questionPaperPdf;
    }

    public function setCourseCode($courseCode)
    {
        $this->courseCode = $courseCode;
    }

    public function setYear($year)
    {
        $this->year = $year;
    }

    public function setSemester($semester)
    {
        $this->semester = $semester;
    }

    /**
     * Convert to array
     */
    public function toArray()
    {
        // Generate filename dynamically: courseCode_year_semester_testName.pdf
        $generatedFilename = null;
        if (!is_null($this->questionPaperPdf) && $this->courseCode && $this->year && $this->semester) {
            // Sanitize test name for filename (remove special chars, spaces to underscores)
            $sanitizedTestName = preg_replace('/[^A-Za-z0-9_\-]/', '_', $this->name);
            $sanitizedTestName = preg_replace('/_+/', '_', $sanitizedTestName); // Remove multiple underscores
            $generatedFilename = $this->courseCode . '_' . $this->year . '_' . $this->semester . '_' . $sanitizedTestName . '.pdf';
        }

        return [
            'id' => $this->id,
            'course_id' => $this->courseId,
            'name' => $this->name,
            'full_marks' => $this->fullMarks,
            'pass_marks' => $this->passMarks,
            'question_paper_filename' => $generatedFilename,
            'has_question_paper_pdf' => !is_null($this->questionPaperPdf)
        ];
    }
}
