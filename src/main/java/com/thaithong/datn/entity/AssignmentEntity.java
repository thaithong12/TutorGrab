package com.thaithong.datn.entity;

import com.thaithong.datn.enums.DifficultType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

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
@Data
public class AssignmentEntity extends BaseEntity {
    private String title;

    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficult_type")
    private DifficultType difficultType = DifficultType.NORMAL;

    @Column(name = "is_answered")
    private Boolean isAnswered;

    @Column(name = "is_published")
    private Boolean isPublished;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "assignment")
    private List<UserAssignment> userAssignments;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private SubjectEntity subject;
}
