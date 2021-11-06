package com.thaithong.datn.repository;

import com.thaithong.datn.entity.AssignmentEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends CrudRepository<AssignmentEntity, Long> {
    List<AssignmentEntity> findByIsAndIsAnsweredAndIsPublished(Boolean isAnswered, Boolean isPublished);
}
