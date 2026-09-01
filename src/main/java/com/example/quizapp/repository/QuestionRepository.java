package com.example.quizapp.repository;

import com.example.quizapp.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Integer> {

    List<Question> findByCategoryAndDifficulty(
            String category,
            String difficulty
    );
}