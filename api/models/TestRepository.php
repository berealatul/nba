<?php

/**
 * Test Repository Class
 * Handles database operations for tests
 */
class TestRepository
{
    private $db;

    public function __construct($dbConnection)
    {
        $this->db = $dbConnection;
    }

    /**
     * Find test by ID
     */
    public function findById($id)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM test WHERE id = ?");
            $stmt->execute([$id]);
            $data = $stmt->fetch();

            if ($data) {
                return new Test(
                    $data['id'],
                    $data['course_id'],
                    $data['name'],
                    $data['full_marks'],
                    $data['pass_marks'],
                    $data['question_link']
                );
            }
            return null;
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }

    /**
     * Find tests by course ID
     */
    public function findByCourseId($courseId)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM test WHERE course_id = ? ORDER BY created_at DESC");
            $stmt->execute([$courseId]);
            $tests = [];

            while ($data = $stmt->fetch()) {
                $tests[] = new Test(
                    $data['id'],
                    $data['course_id'],
                    $data['name'],
                    $data['full_marks'],
                    $data['pass_marks'],
                    $data['question_link']
                );
            }

            return $tests;
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }

    /**
     * Save test
     */
    public function save(Test $test)
    {
        try {
            if ($test->getId()) {
                // Update existing test
                $stmt = $this->db->prepare("UPDATE test SET course_id = ?, name = ?, full_marks = ?, pass_marks = ?, question_link = ? WHERE id = ?");
                return $stmt->execute([
                    $test->getCourseId(),
                    $test->getName(),
                    $test->getFullMarks(),
                    $test->getPassMarks(),
                    $test->getQuestionLink(),
                    $test->getId()
                ]);
            } else {
                // Insert new test
                $stmt = $this->db->prepare("INSERT INTO test (course_id, name, full_marks, pass_marks, question_link) VALUES (?, ?, ?, ?, ?)");
                $result = $stmt->execute([
                    $test->getCourseId(),
                    $test->getName(),
                    $test->getFullMarks(),
                    $test->getPassMarks(),
                    $test->getQuestionLink()
                ]);

                if ($result) {
                    $test->setId($this->db->lastInsertId());
                }

                return $result;
            }
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }

    /**
     * Delete test
     */
    public function delete($id)
    {
        try {
            $stmt = $this->db->prepare("DELETE FROM test WHERE id = ?");
            return $stmt->execute([$id]);
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }
}
