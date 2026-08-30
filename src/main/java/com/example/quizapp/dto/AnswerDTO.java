package com.example.quizapp.dto;

public class AnswerDTO {

    private Integer questionId;
    private String answer;

    public AnswerDTO() {
    }

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}