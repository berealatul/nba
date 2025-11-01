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
    private $questionLink;

    public function __construct($id, $courseId, $name, $fullMarks, $passMarks, $questionLink = null)
    {
        $this->id = $id;
        $this->setCourseId($courseId);
        $this->setName($name);
        $this->setFullMarks($fullMarks);
        $this->setPassMarks($passMarks);
        $this->questionLink = $questionLink;
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
    public function getQuestionLink()
    {
        return $this->questionLink;
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

    public function setQuestionLink($questionLink)
    {
        $this->questionLink = $questionLink;
    }

    /**
     * Convert to array
     */
    public function toArray()
    {
        return [
            'id' => $this->id,
            'course_id' => $this->courseId,
            'name' => $this->name,
            'full_marks' => $this->fullMarks,
            'pass_marks' => $this->passMarks,
            'question_link' => $this->questionLink
        ];
    }
}
