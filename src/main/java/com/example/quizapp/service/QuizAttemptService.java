package com.example.quizapp.service;

import com.example.quizapp.model.QuizAttempt;
import com.example.quizapp.repository.QuizAttemptRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuizAttemptService {

    private final QuizAttemptRepository quizAttemptRepository;

    public QuizAttemptService(QuizAttemptRepository quizAttemptRepository) {
        this.quizAttemptRepository = quizAttemptRepository;
    }

    public QuizAttempt saveAttempt(QuizAttempt attempt) {

        attempt.setCompletedAt(LocalDateTime.now());

        return quizAttemptRepository.save(attempt);
    }

    public QuizAttempt saveQuizResult(
            String category,
            String difficulty,
            int totalQuestions,
            int correctAnswers,
            int wrongAnswers,
            int score) {

        QuizAttempt attempt = new QuizAttempt();

        attempt.setCategory(category);
        attempt.setDifficulty(difficulty);
        attempt.setTotalQuestions(totalQuestions);
        attempt.setCorrectAnswers(correctAnswers);
        attempt.setWrongAnswers(wrongAnswers);
        attempt.setScore(score);

        return saveAttempt(attempt);
    }

    public List<QuizAttempt> getAllAttempts() {

        return quizAttemptRepository.findAll();
    }

    public QuizAttempt getAttemptById(Long id) {

        return quizAttemptRepository.findById(id).orElse(null);
    }
}