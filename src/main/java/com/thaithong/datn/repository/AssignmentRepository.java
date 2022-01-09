package com.thaithong.datn.repository;

import com.thaithong.datn.entity.AssignmentEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends CrudRepository<AssignmentEntity, Long> {
    List<AssignmentEntity> findByIsAnsweredAndIsPublishedAndIsDeleted(Boolean isAnswered, Boolean isPublished, Boolean isDeleted);

    List<AssignmentEntity> findByIsDeleted(Boolean isDeleted);

    AssignmentEntity findByIdAndIsDeleted(Long id , Boolean isDeleted);

    @Query(value = "SELECT\n" +
            "\tassignments.* \n" +
            "FROM\n" +
            "\t`assignments`\n" +
            "\tJOIN user_assginments ON assignments.id = user_assginments.assignment_id \n" +
            "WHERE\n" +
            "\tuser_assginments.is_completed = 0 \n" +
            "\tOR user_assginments.is_rejected = 1;", nativeQuery = true)
    List<AssignmentEntity> findAllTodoAssignment ();
}
