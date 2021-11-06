package com.thaithong.datn.service;

import com.thaithong.datn.entity.AssignmentEntity;
import com.thaithong.datn.entity.UserAssignment;
import com.thaithong.datn.repository.AssignmentRepository;
import com.thaithong.datn.repository.UserAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssigmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private UserAssignmentRepository userAssignmentRepository;

    /**
     * @return すべて問題を返却
     */
    public List<AssignmentEntity> getAllAssignments() {
        return handleOption(1);
    }

    /**
     * @param flag 返事したフラグ
     * @return 返事したフラグとして問題の一覧を返却
     */
    public List<AssignmentEntity> getAllAssignmentsWithIsAnsweredAndIsPublished(Boolean flag) {
        if (flag) {
            return handleOption(2);
        } else {
            return handleOption(3);
        }
    }

    public List<AssignmentEntity> getAssignmentByAnsweredIdOrPutterId(Long userId, String who) {
        List<UserAssignment> userAssignments;
        if (who.equals("putter")) {
            userAssignments = userAssignmentRepository.findByRequestId(userId);
        } else {
            userAssignments = userAssignmentRepository.findByResponseId(userId);
        }
        if (!CollectionUtils.isEmpty(userAssignments)) {
            return userAssignments.stream()
                    .map(UserAssignment::getAssignment)
                    .collect(Collectors.toList());
        }
        return new ArrayList<>();
    }

    private List<AssignmentEntity> handleOption(int indicator) {
        switch (indicator) {
            //
            case 1:
                return (List<AssignmentEntity>) assignmentRepository.findAll();
            case 2:
                return assignmentRepository.findByIsAndIsAnsweredAndIsPublished(false, false);
            case 3:
                return assignmentRepository.findByIsAndIsAnsweredAndIsPublished(true, true);
            default:
                return null;
        }
    }
}
