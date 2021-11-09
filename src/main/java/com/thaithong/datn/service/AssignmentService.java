package com.thaithong.datn.service;

import com.thaithong.datn.entity.AssignmentEntity;
import com.thaithong.datn.entity.UserAssignment;
import com.thaithong.datn.model.AssignmentRequestModel;
import com.thaithong.datn.model.AssignmentResponseModel;
import com.thaithong.datn.model.SubjectResponseModel;
import com.thaithong.datn.repository.AssignmentRepository;
import com.thaithong.datn.repository.SubjectRepository;
import com.thaithong.datn.repository.UserAssignmentRepository;
import com.thaithong.datn.utils.CustomErrorException;
import com.thaithong.datn.utils.ErrorObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private UserAssignmentRepository userAssignmentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    /**
     * @return すべて問題を返却
     */
    public List<AssignmentResponseModel> getAllAssignments() {
        return handleOption(1);
    }

    public AssignmentResponseModel getAssignment(Long id) {
        var ass = assignmentRepository.findByIdAndIsDeleted(id, false);
        throwNotFoundException(id, ass);
        return convertEntityToResponseModel(ass);
    }

    /**
     * @param flag 返事したフラグ
     * @return 返事したフラグとして問題の一覧を返却
     */
    public List<AssignmentResponseModel> getAllAssignmentsWithIsAnsweredAndIsPublished(Boolean flag) {
        if (flag) {
            return handleOption(2);
        } else {
            return handleOption(3);
        }
    }

    public void deleteAssignment(Long id) {
        var ass = assignmentRepository.findByIdAndIsDeleted(id, false);
        throwNotFoundException(id, ass);
        ass.setIsDeleted(true);
        assignmentRepository.save(ass);
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

    private List<AssignmentResponseModel> handleOption(int indicator) {
        switch (indicator) {
            case 1: {
                var asss = assignmentRepository.findByIsDeleted(false);
                var listReturn = new ArrayList<AssignmentResponseModel>();
                if (!CollectionUtils.isEmpty(asss)) {
                    asss.forEach(item -> listReturn.add(convertEntityToResponseModel(item)));
                }
                return listReturn;
            }
            case 2:
//                return assignmentRepository.findByIsAnsweredAndIsPublishedAndIsDeleted(false, false, false);
                return null;
            case 3:
//                return assignmentRepository.findByIsAnsweredAndIsPublishedAndIsDeleted(true, true, false);
                return null;
            default:
                return null;
        }
    }

    public AssignmentResponseModel updateAssignment (Long id, AssignmentRequestModel requestModel) {
        var assignment = assignmentRepository.findByIdAndIsDeleted(id, false);
        throwNotFoundException(id, assignment);
        assignment.setTitle(requestModel.getTitle());
        assignment.setContent(requestModel.getContent());
        assignment.setIsAnswered(requestModel.getIsAnswered());
        assignment.setIsPublished(requestModel.getIsPublished());
        assignment.setIsPublished(requestModel.getIsPublished());

        var subject = subjectRepository.findById(requestModel.getSubjectId());
        if (subject.isEmpty()) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E400001", "Subject is not exist"));
        } else {
            assignment.setSubject(subject.get());

        }
        assignmentRepository.save(assignment);

        return getAssignment(id);
    }

    private void throwNotFoundException(Long id, AssignmentEntity assignment) {
        if (Objects.isNull(assignment)) {
            throw new CustomErrorException(HttpStatus.NOT_FOUND,
                    new ErrorObject("E404001", "Assignment not found with id = " + id));
        }
    }

    public void createAssignment(AssignmentRequestModel requestModel) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        UserModel userModel = (UserModel) authentication.getPrincipal();
        if (!Objects.isNull(requestModel)) {
            if (!Objects.isNull(requestModel.getSubjectId())) {
                var subject = subjectRepository.findById(requestModel.getSubjectId());
                if (subject.isEmpty()) {
                    throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                            new ErrorObject("E400001", "Subject is not exist"));
                } else {
                    var ass = new AssignmentEntity();
                    ass.setContent(requestModel.getContent());
                    ass.setTitle(requestModel.getTitle());
                    ass.setDifficultType(requestModel.getDifficultType());
                    ass.setIsAnswered(false);
                    ass.setIsPublished(false);
                    ass.setIsDeleted(false);
                    ass.setSubject(subject.get());
                    assignmentRepository.save(ass);
                }
            }

        }
    }

    private AssignmentResponseModel convertEntityToResponseModel(AssignmentEntity assignmentEntity) {
        var ass = new AssignmentResponseModel();
        ass.setId(assignmentEntity.getId());
        ass.setCreatedAt(assignmentEntity.getCreatedAt());
        ass.setCreatedBy(assignmentEntity.getCreatedBy());
        ass.setUpdatedAt(assignmentEntity.getUpdatedAt());
        ass.setUpdatedBy(assignmentEntity.getUpdatedBy());
        ass.setContent(assignmentEntity.getContent());
        ass.setTitle(assignmentEntity.getTitle());
        ass.setDifficultType(assignmentEntity.getDifficultType());
        ass.setIsAnswered(assignmentEntity.getIsAnswered());
        ass.setIsDeleted(assignmentEntity.getIsDeleted());
        ass.setIsPublished(assignmentEntity.getIsPublished());
        if (!Objects.isNull(assignmentEntity.getSubject())) {
            var subj = new SubjectResponseModel();
            subj.setId(assignmentEntity.getSubject().getId());
            subj.setCreatedAt(assignmentEntity.getSubject().getCreatedAt());
            subj.setCreatedBy(assignmentEntity.getSubject().getCreatedBy());
            subj.setUpdatedAt(assignmentEntity.getSubject().getUpdatedAt());
            subj.setUpdatedBy(assignmentEntity.getSubject().getUpdatedBy());
            subj.setName(assignmentEntity.getSubject().getName());
            ass.setSubject(subj);
        }
        return ass;
    }
}
