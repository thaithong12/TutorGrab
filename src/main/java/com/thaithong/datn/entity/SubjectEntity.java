package com.thaithong.datn.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "subjects")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SubjectEntity extends BaseEntity {
    private String name;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "subject")
    private List<AssignmentEntity> assignments;
}
