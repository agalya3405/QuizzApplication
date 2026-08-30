package com.example.quizapp.service;

import com.example.quizapp.dto.AnswerDTO;
import com.example.quizapp.dto.QuestionDTO;
import com.example.quizapp.dto.ResultDTO;
import com.example.quizapp.model.Question;
import com.example.quizapp.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }
    public Question getQuestionById(Integer id) {
    return questionRepository.findById(id).orElse(null);
    }
    public Question updateQuestion(Integer id, Question updatedQuestion) {

    Question existingQuestion = questionRepository
            .findById(id)
            .orElse(null);

    if (existingQuestion == null) {
        return null;
    }

    existingQuestion.setQuestion(updatedQuestion.getQuestion());
    existingQuestion.setOption1(updatedQuestion.getOption1());
    existingQuestion.setOption2(updatedQuestion.getOption2());
    existingQuestion.setOption3(updatedQuestion.getOption3());
    existingQuestion.setOption4(updatedQuestion.getOption4());
    existingQuestion.setRightAnswer(updatedQuestion.getRightAnswer());

    return questionRepository.save(existingQuestion);
}

    public Question addQuestion(Question question) {
        return questionRepository.save(question);
    }

    public QuestionDTO convertToDTO(Question question) {

        QuestionDTO dto = new QuestionDTO();

        dto.setId(question.getId());
        dto.setQuestion(question.getQuestion());
        dto.setOption1(question.getOption1());
        dto.setOption2(question.getOption2());
        dto.setOption3(question.getOption3());
        dto.setOption4(question.getOption4());

        return dto;
    }
    public List<QuestionDTO> getQuizQuestions() {

    List<Question> questions = questionRepository.findAll();

    return questions.stream()
            .map(this::convertToDTO)
            .toList();
}

public ResultDTO calculateScore(List<AnswerDTO> answers) {

    int totalQuestions = answers.size();
    int correctAnswers = 0;

    for (AnswerDTO answer : answers) {

        Question question = questionRepository
                .findById(answer.getQuestionId())
                .orElse(null);

        if (question != null &&
            question.getRightAnswer().equals(answer.getAnswer())) {

            correctAnswers++;
        }
    }

    int wrongAnswers = totalQuestions - correctAnswers;

    return new ResultDTO(
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            correctAnswers
    );
}
public void deleteQuestion(Integer id) {
    questionRepository.deleteById(id);
}

}



