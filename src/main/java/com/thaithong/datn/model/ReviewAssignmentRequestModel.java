package com.thaithong.datn.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReviewAssignmentRequestModel {
    private Long assignmentId;

    private Long requestId;

    private Long responseId;

    private Boolean isAccepted;

    private String reason;

    private Integer rate;
}
