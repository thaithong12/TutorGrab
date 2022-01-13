package com.thaithong.datn.service;

import com.thaithong.datn.entity.NotificationEntity;
import com.thaithong.datn.entity.RequestEntity;
import com.thaithong.datn.model.RequestForAssignmentModel;
import com.thaithong.datn.model.RequestListUserResponseModel;
import com.thaithong.datn.repository.RequestRepository;
import com.thaithong.datn.repository.UserAssignmentRepository;
import com.thaithong.datn.utils.CustomErrorException;
import com.thaithong.datn.utils.ErrorObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.List;

@Service
public class RequestService {
    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private UserAssignmentRepository userAssignmentRepository;

    public List<RequestListUserResponseModel> getRequestsOfUser(Long userId) {
        var request = requestRepository.findByResponseId(userId);
        var listReturn = new ArrayList<RequestListUserResponseModel>();
        if (!CollectionUtils.isEmpty(request)) {
            request.forEach(i -> listReturn.add(convertEntityToModel(i)));
        }
        return listReturn;
    }

    public List<RequestListUserResponseModel> getRequestsOfAssignment(Long assignmentId) {
        var request = requestRepository.findByAssignmentId(assignmentId);
        var listReturn = new ArrayList<RequestListUserResponseModel>();
        if (!CollectionUtils.isEmpty(request)) {
            request.forEach(i -> listReturn.add(convertEntityToModel(i)));
        }
        return listReturn;
    }

    private RequestListUserResponseModel convertEntityToModel (RequestEntity requestEntity) {
        var res = new RequestListUserResponseModel();
        res.setId(requestEntity.getId());
        res.setRequestId(requestEntity.getRequestId());
        res.setResponseId(requestEntity.getResponseId());
        res.setIsAccepted(requestEntity.getIsAccepted());
        res.setAssignmentId(requestEntity.getAssignmentId());
        return res;
    }

    public RequestListUserResponseModel createRequestForAssignment(RequestForAssignmentModel requestModel) {
        var requestEntity = requestRepository.findByAssignmentIdAndResponseId(
                requestModel.getAssignmentId(), requestModel.getResponseId());
        if (!ObjectUtils.isEmpty(requestEntity)) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E404001", "You have request this assignment!!"));
        }
        requestEntity = new RequestEntity();
        requestEntity.setAssignmentId(requestModel.getAssignmentId());
        requestEntity.setResponseId(requestModel.getResponseId());
        requestEntity.setIsAccepted(false);
        requestEntity.setIsDeleted(false);
        var userAss= userAssignmentRepository.findByResponseIdAndAssignmentId(requestModel.getResponseId(),
                requestModel.getAssignmentId());
        var notification = new NotificationEntity();
        notification.setContent(String.format("User%s want to solve this assignment %s",
                userService.getUserInfo(requestModel.getResponseId()).getId(),
                assignmentService.getAssignment(requestModel.getAssignmentId()).getSubject().getName()));
        notification.setIsRead(false);
        notification.setSenderId(requestModel.getResponseId());
//        notification.setReceiverId(userAss.getRequestId());
        requestEntity.setNotificationEntity(notification);
        var obj = requestRepository.save(requestEntity);
        return convertEntityToModel(obj);
    }

    public Boolean isHaveSendRequestSolve(Long assignmentId, Long userId) {
        var requestEntity = requestRepository.findByAssignmentIdAndResponseId(assignmentId, userId);
        if (!ObjectUtils.isEmpty(requestEntity)) {
            return true;
        }
        return false;
    }
}
