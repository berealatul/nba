<?php

/**
 * Question Repository Class
 * Handles database operations for questions
 */
class QuestionRepository
{
    private $db;

    public function __construct($dbConnection)
    {
        $this->db = $dbConnection;
    }

    /**
     * Find question by ID
     */
    public function findById($id)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM question WHERE id = ?");
            $stmt->execute([$id]);
            $data = $stmt->fetch();

            if ($data) {
                return new Question(
                    $data['id'],
                    $data['test_id'],
                    $data['question_number'],
                    $data['sub_question'],
                    $data['is_optional'],
                    $data['co'],
                    $data['max_marks']
                );
            }
            return null;
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }

    /**
     * Find questions by test ID
     */
    public function findByTestId($testId)
    {
        try {
            $stmt = $this->db->prepare(
                "SELECT * FROM question WHERE test_id = ? 
                ORDER BY question_number, sub_question"
            );
            $stmt->execute([$testId]);
            $questions = [];

            while ($data = $stmt->fetch()) {
                $questions[] = new Question(
                    $data['id'],
                    $data['test_id'],
                    $data['question_number'],
                    $data['sub_question'],
                    $data['is_optional'],
                    $data['co'],
                    $data['max_marks']
                );
            }

            return $questions;
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }

    /**
     * Save question
     */
    public function save(Question $question)
    {
        try {
            if ($question->getId()) {
                // Update existing question
                $stmt = $this->db->prepare(
                    "UPDATE question SET 
                    test_id = ?, question_number = ?, sub_question = ?, 
                    is_optional = ?, co = ?, max_marks = ? 
                    WHERE id = ?"
                );
                return $stmt->execute([
                    $question->getTestId(),
                    $question->getQuestionNumber(),
                    $question->getSubQuestion(),
                    $question->getIsOptional(),
                    $question->getCo(),
                    $question->getMaxMarks(),
                    $question->getId()
                ]);
            } else {
                // Insert new question
                $stmt = $this->db->prepare(
                    "INSERT INTO question 
                    (test_id, question_number, sub_question, is_optional, co, max_marks) 
                    VALUES (?, ?, ?, ?, ?, ?)"
                );
                $result = $stmt->execute([
                    $question->getTestId(),
                    $question->getQuestionNumber(),
                    $question->getSubQuestion(),
                    $question->getIsOptional(),
                    $question->getCo(),
                    $question->getMaxMarks()
                ]);

                if ($result) {
                    $question->setId($this->db->lastInsertId());
                }

                return $result;
            }
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }

    /**
     * Save multiple questions in a transaction
     */
    public function saveMultiple($questions)
    {
        try {
            $this->db->beginTransaction();

            foreach ($questions as $question) {
                $this->save($question);
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw new Exception("Failed to save questions: " . $e->getMessage());
        }
    }

    /**
     * Delete question
     */
    public function delete($id)
    {
        try {
            $stmt = $this->db->prepare("DELETE FROM question WHERE id = ?");
            return $stmt->execute([$id]);
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }

    /**
     * Delete all questions for a test
     */
    public function deleteByTestId($testId)
    {
        try {
            $stmt = $this->db->prepare("DELETE FROM question WHERE test_id = ?");
            return $stmt->execute([$testId]);
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }
}
