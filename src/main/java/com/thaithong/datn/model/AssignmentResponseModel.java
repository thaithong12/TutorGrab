package com.thaithong.datn.model;

import com.thaithong.datn.enums.DifficultType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentResponseModel {
    private Long id;

    private String textContent;

    private Date createdAt;

    private Date updatedAt;

    private String createdBy;

    private String updatedBy;

    private String title;

    private String content;

    private Double rate;

    private String grade;

    private DifficultType difficultType;

    private Boolean isAnswered;

    private Boolean isPublished;

    private Boolean isRejected;

    private Boolean isDeleted;

    private String reason;

    private Long requestId;

    private Long responseId;

    private String answer;

    private SubjectResponseModel subject;
}
