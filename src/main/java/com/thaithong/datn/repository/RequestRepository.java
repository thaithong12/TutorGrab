package com.thaithong.datn.repository;

import com.thaithong.datn.entity.RequestEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends CrudRepository<RequestEntity, Long> {
    List<RequestEntity> findByAssignmentId(Long id);

    List<RequestEntity> findByResponseId(Long id);

    RequestEntity findByAssignmentIdAndResponseId(Long assignmentId, Long responseId);
}
