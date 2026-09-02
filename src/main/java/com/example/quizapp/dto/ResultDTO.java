package com.example.quizapp.dto;

import java.util.List;

public class ResultDTO {

    private int totalQuestions;
    private int correctAnswers;
    private int wrongAnswers;
    private int score;
    private List<ReviewDTO> review;

    public ResultDTO() {
    }

    public ResultDTO(int totalQuestions, int correctAnswers, int wrongAnswers,
                      int score, List<ReviewDTO> review) {
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.wrongAnswers = wrongAnswers;
        this.score = score;
        this.review = review;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public int getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(int correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public int getWrongAnswers() {
        return wrongAnswers;
    }

    public void setWrongAnswers(int wrongAnswers) {
        this.wrongAnswers = wrongAnswers;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public List<ReviewDTO> getReview() {
        return review;
    }

    public void setReview(List<ReviewDTO> review) {
        this.review = review;
    }
}