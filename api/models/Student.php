<?php

/**
 * Student Model
 * Represents a student entity
 */
class Student
{
    private $rollno;
    private $name;
    private $dept;

    public function __construct($rollno, $name, $dept)
    {
        $this->rollno = $rollno;
        $this->name = $name;
        $this->dept = $dept;
    }

    // Getters
    public function getRollno()
    {
        return $this->rollno;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getDept()
    {
        return $this->dept;
    }

    // Setters
    public function setName($name)
    {
        $this->name = $name;
    }

    public function setDept($dept)
    {
        $this->dept = $dept;
    }

    /**
     * Convert to array
     */
    public function toArray()
    {
        return [
            'rollno' => $this->rollno,
            'name' => $this->name,
            'dept' => $this->dept
        ];
    }
}
