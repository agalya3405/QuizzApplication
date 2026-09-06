package com.example.quizapp.controller;

import com.example.quizapp.model.QuizAttempt;
import com.example.quizapp.service.QuizAttemptService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attempts")
@CrossOrigin
public class QuizAttemptController {

    private final QuizAttemptService quizAttemptService;

    public QuizAttemptController(QuizAttemptService quizAttemptService) {
        this.quizAttemptService = quizAttemptService;
    }

    @GetMapping
    public List<QuizAttempt> getAllAttempts() {
        return quizAttemptService.getAllAttempts();
    }

    @GetMapping("/{id}")
    public QuizAttempt getAttemptById(@PathVariable Long id) {
        return quizAttemptService.getAttemptById(id);
    }
}