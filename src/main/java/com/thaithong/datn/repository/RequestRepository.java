package com.thaithong.datn.repository;

import com.thaithong.datn.entity.RequestEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends CrudRepository<RequestEntity, Long> {
//    List<RequestEntity> findByAssignmentId(Long id);
    List<RequestEntity> findByAssignmentEntity_Id(Long id);

    List<RequestEntity> findByAssignmentEntity_IdAndIsDeleted(Long id, Boolean isDeleted);

    List<RequestEntity> findByResponseId(Long id);

    List<RequestEntity> findByRequestIdAndIsDeleted(Long id, Boolean isDeleted);

    RequestEntity findByAssignmentEntity_IdAndResponseId(Long assignmentId, Long responseId);
}
