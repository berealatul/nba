<?php

class Enrollment
{
    private $id;
    private $courseId;
    private $studentRollno;
    private $enrolledAt;

    public function __construct($id, $courseId, $studentRollno, $enrolledAt = null)
    {
        $this->id = $id;
        $this->courseId = $courseId;
        $this->studentRollno = $studentRollno;
        $this->enrolledAt = $enrolledAt;
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

    public function getStudentRollno()
    {
        return $this->studentRollno;
    }

    public function getEnrolledAt()
    {
        return $this->enrolledAt;
    }

    // Setters
    public function setId($id)
    {
        $this->id = $id;
    }

    public function setCourseId($courseId)
    {
        $this->courseId = $courseId;
    }

    public function setStudentRollno($studentRollno)
    {
        $this->studentRollno = $studentRollno;
    }

    public function setEnrolledAt($enrolledAt)
    {
        $this->enrolledAt = $enrolledAt;
    }

    /**
     * Convert to array
     */
    public function toArray()
    {
        return [
            'id' => $this->id,
            'course_id' => $this->courseId,
            'student_rollno' => $this->studentRollno,
            'enrolled_at' => $this->enrolledAt
        ];
    }
}
