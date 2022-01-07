package com.thaithong.datn.entity;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "user_assginments")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserAssignment extends BaseEntity {
    /**
     * studentId
     */
    @Column(name = "request_id")
    private Long requestId;

    /**
     * teacherId
     */
    @Column(name = "response_id")
    private Long responseId;

    private Double rate;

    @Column(name = "is_completed")
    private Boolean isCompleted;

    @Column(name = "is_rejected")
    private Boolean isRejected;

    private String reason;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "assignment_id")
    private AssignmentEntity assignment;
}
