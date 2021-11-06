package com.thaithong.datn.repository;

import com.thaithong.datn.entity.UserAssignment;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAssignmentRepository extends CrudRepository<UserAssignment, Long> {
    List<UserAssignment> findByRequestId(Long requestId);

    List<UserAssignment> findByResponseId(Long responseId);
}
