package com.thaithong.datn.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "subjects")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SubjectEntity extends BaseEntity {
    private String name;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "subject", fetch = FetchType.LAZY)
    private List<AssignmentEntity> assignments;
}
