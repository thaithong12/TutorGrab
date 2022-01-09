package com.thaithong.datn.model;

import com.thaithong.datn.enums.DifficultType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentRequestModel {
    private String content;

    private DifficultType difficultType;

    private String title;

    private Long subjectId;

    private String grade;

    private String subject;

    private Boolean isAnswered;

    private Boolean isPublished;

    private Long userId;
}
