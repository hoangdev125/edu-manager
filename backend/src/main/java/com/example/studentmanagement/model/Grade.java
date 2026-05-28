package com.example.studentmanagement.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Embeddable
public class Grade {
    @NotBlank
    private String subjectCode;

    @NotBlank
    private String subjectName;

    @NotBlank
    private String semester;

    @Min(0)
    @Max(10)
    private double attendanceScore;

    @Min(0)
    @Max(10)
    private double midtermScore;

    @Min(0)
    @Max(10)
    private double finalScore;

    @Min(0)
    @Max(100)
    private int attendanceWeight = 10;

    @Min(0)
    @Max(100)
    private int midtermWeight = 30;

    @Min(0)
    @Max(100)
    private int finalWeight = 60;

    @Min(0)
    @Max(10)
    private double score;

    public Grade() {
    }

    public Grade(String subjectCode, String subjectName, String semester, 
                 double attendanceScore, double midtermScore, double finalScore,
                 int attendanceWeight, int midtermWeight, int finalWeight) {
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.semester = semester;
        this.attendanceScore = attendanceScore;
        this.midtermScore = midtermScore;
        this.finalScore = finalScore;
        this.attendanceWeight = attendanceWeight;
        this.midtermWeight = midtermWeight;
        this.finalWeight = finalWeight;
        calculateScore();
    }

    public void calculateScore() {
        double raw = (this.attendanceScore * this.attendanceWeight 
                    + this.midtermScore * this.midtermWeight 
                    + this.finalScore * this.finalWeight) / 100.0;
        this.score = Math.round(raw * 100.0) / 100.0;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public double getAttendanceScore() {
        return attendanceScore;
    }

    public void setAttendanceScore(double attendanceScore) {
        this.attendanceScore = attendanceScore;
        calculateScore();
    }

    public double getMidtermScore() {
        return midtermScore;
    }

    public void setMidtermScore(double midtermScore) {
        this.midtermScore = midtermScore;
        calculateScore();
    }

    public double getFinalScore() {
        return finalScore;
    }

    public void setFinalScore(double finalScore) {
        this.finalScore = finalScore;
        calculateScore();
    }

    public int getAttendanceWeight() {
        return attendanceWeight;
    }

    public void setAttendanceWeight(int attendanceWeight) {
        this.attendanceWeight = attendanceWeight;
        calculateScore();
    }

    public int getMidtermWeight() {
        return midtermWeight;
    }

    public void setMidtermWeight(int midtermWeight) {
        this.midtermWeight = midtermWeight;
        calculateScore();
    }

    public int getFinalWeight() {
        return finalWeight;
    }

    public void setFinalWeight(int finalWeight) {
        this.finalWeight = finalWeight;
        calculateScore();
    }

    public double getScore() {
        calculateScore();
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }
}
