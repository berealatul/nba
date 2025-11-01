<?php

/**
 * RawMarks Model
 * Represents per-question marks for a student in a test
 */
class RawMarks
{
    private $id;
    private $testId;
    private $studentId;
    private $questionId;
    private $marks;

    public function __construct($testId, $studentId, $questionId, $marks, $id = null)
    {
        $this->id = $id;
        $this->testId = $testId;
        $this->studentId = $studentId;
        $this->questionId = $questionId;
        $this->marks = $marks;
    }

    // Getters
    public function getId()
    {
        return $this->id;
    }

    public function getTestId()
    {
        return $this->testId;
    }

    public function getStudentId()
    {
        return $this->studentId;
    }

    public function getQuestionId()
    {
        return $this->questionId;
    }

    public function getMarks()
    {
        return $this->marks;
    }

    // Setters
    public function setId($id)
    {
        $this->id = $id;
    }

    public function setMarks($marks)
    {
        $this->marks = $marks;
    }

    /**
     * Convert to array
     */
    public function toArray()
    {
        return [
            'id' => $this->id,
            'test_id' => $this->testId,
            'student_id' => $this->studentId,
            'question_id' => $this->questionId,
            'marks' => $this->marks
        ];
    }
}
