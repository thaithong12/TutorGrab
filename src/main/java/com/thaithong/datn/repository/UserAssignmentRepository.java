package com.thaithong.datn.repository;

import com.thaithong.datn.entity.UserAssignment;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAssignmentRepository extends CrudRepository<UserAssignment, Long> {
    List<UserAssignment> findByRequestId(Long requestId);

    List<UserAssignment> findByResponseId(Long responseId);

    @Query(value = "SELECT\n" +
            "\tuser_assginments.id,\n" +
            "\tuser_assginments.created_at,\n" +
            "\tuser_assginments.created_by,\n" +
            "\tuser_assginments.updated_at,\n" +
            "\tuser_assginments.updated_by,\n" +
            "\tuser_assginments.is_completed,\n" +
            "\tuser_assginments.is_rejected,\n" +
            "\tAVG( user_assginments.rate ) AS `rate`,\n" +
            "\tuser_assginments.reason,\n" +
            "\tuser_assginments.request_id,\n" +
            "\tuser_assginments.response_id,\n" +
            "\tuser_assginments.assignment_id,\n" +
            "\tuser_assginments.user_id \n" +
            "FROM\n" +
            "\tuser_assginments\n" +
            "\tINNER JOIN users ON user_assginments.response_id = users.id \n" +
            "WHERE\n" +
            "\tusers.is_blocked = 0 \n" +
            "\tAND user_assginments.is_completed = 1 \n" +
            "\tOR user_assginments.is_rejected IS NOT NULL \n" +
            "GROUP BY\n" +
            "\tuser_assginments.response_id \n" +
            "ORDER BY\n" +
            "\t`rate` DESC", nativeQuery = true)
    List<UserAssignment> findTopUser ();

    UserAssignment findByRequestIdAndAssignmentId(Long responseId , Long assignmentId);

    UserAssignment findByAssignmentId(Long assignmentId);
}
