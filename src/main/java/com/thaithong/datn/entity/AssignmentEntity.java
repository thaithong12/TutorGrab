package com.thaithong.datn.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.thaithong.datn.enums.DifficultType;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "assignments")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AssignmentEntity extends BaseEntity {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String title;

    @Lob
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String content;

    @Lob
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String textContent;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficult_type")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private DifficultType difficultType = DifficultType.NORMAL;

    @Column(name = "is_answered")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Boolean isAnswered;

    @Column(name = "answer")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String answer;

    @Column(name = "is_published")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Boolean isPublished;

    @Column(name = "is_deleted")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Boolean isDeleted;

    @Column(name = "grade")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String grade;

    @Column(name = "assignment_url")
    private String assignmentUrl;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "assignment")
    private List<UserAssignment> userAssignments;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private SubjectEntity subject;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "assignmentEntity")
    private List<RequestEntity> requestEntities;
}
