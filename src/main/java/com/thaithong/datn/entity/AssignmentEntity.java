package com.thaithong.datn.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.thaithong.datn.enums.DifficultType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
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

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficult_type")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private DifficultType difficultType = DifficultType.NORMAL;

    @Column(name = "is_answered")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Boolean isAnswered;

    @Column(name = "is_published")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Boolean isPublished;

    @Column(name = "is_deleted")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Boolean isDeleted;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "assignment")
    private List<UserAssignment> userAssignments;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private SubjectEntity subject;
}
