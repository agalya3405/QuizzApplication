package com.example.quizapp.controller;

import com.example.quizapp.dto.AnswerDTO;
import com.example.quizapp.dto.QuestionDTO;
import com.example.quizapp.dto.ResultDTO;
import com.example.quizapp.model.Question;
import com.example.quizapp.service.QuestionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class QuizController {

    private final QuestionService questionService;

    public QuizController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/questions")
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    @GetMapping("/quiz")
    public List<QuestionDTO> getQuizQuestions() {
        return questionService.getQuizQuestions();
    }

    @PostMapping("/questions")
    public Question addQuestion(@RequestBody Question question) {
        return questionService.addQuestion(question);
    }

 @PostMapping("/quiz/submit")
public ResultDTO submitQuiz(@RequestBody List<AnswerDTO> answers) {
    return questionService.calculateScore(answers);
}

@GetMapping("/questions/{id}")
public Question getQuestionById(@PathVariable Integer id) {
    return questionService.getQuestionById(id);
}
@PutMapping("/questions/{id}")
public Question updateQuestion(
        @PathVariable Integer id,
        @RequestBody Question question) {

    return questionService.updateQuestion(id, question);
}
@DeleteMapping("/questions/{id}")
public void deleteQuestion(@PathVariable Integer id) {
    questionService.deleteQuestion(id);
}
}