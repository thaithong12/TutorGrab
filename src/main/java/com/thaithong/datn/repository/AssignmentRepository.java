package com.thaithong.datn.repository;

import com.thaithong.datn.entity.AssignmentEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends CrudRepository<AssignmentEntity, Long> {
    List<AssignmentEntity> findByIsAnsweredAndIsPublishedAndIsDeleted(Boolean isAnswered, Boolean isPublished, Boolean isDeleted);

    List<AssignmentEntity> findByIsDeleted(Boolean isDeleted);

    AssignmentEntity findByIdAndIsDeleted(Long id , Boolean isDeleted);
}
