package com.thaithong.datn.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserAssignmentResponseModel {
    private Long id;

    private Date createdAt;

    private Date updatedAt;

    private String createdBy;

    private String updatedBy;
    /**
     * studentId
     */
    private Long requestId;

    /**
     * teacherId
     */
    private Long responseId;

    private Integer rate;

    private Boolean isCompleted;

    private Boolean isRejected;

    private String reason;

    private int totalAnswered;

    private UserResponseModel responseInfo;
}
