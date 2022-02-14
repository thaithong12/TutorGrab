package com.thaithong.datn.service;

import com.thaithong.datn.entity.NotificationEntity;
import com.thaithong.datn.entity.RequestEntity;
import com.thaithong.datn.enums.DifficultType;
import com.thaithong.datn.model.RequestForAssignmentModel;
import com.thaithong.datn.model.RequestListUserResponseModel;
import com.thaithong.datn.repository.AssignmentRepository;
import com.thaithong.datn.repository.RequestRepository;
import com.thaithong.datn.repository.UserAssignmentRepository;
import com.thaithong.datn.utils.CustomErrorException;
import com.thaithong.datn.utils.ErrorObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private AssignmentRepository assignmentRepository;

    public List<RequestListUserResponseModel> getRequestsOfUser(Long userId) {
        var request = requestRepository.findByRequestIdAndIsDeleted(userId, false);
        var listReturn = new ArrayList<RequestListUserResponseModel>();
        if (!CollectionUtils.isEmpty(request)) {
            request.forEach(i -> listReturn.add(convertEntityToModel(i)));
        }
        return listReturn;
    }

    public List<RequestListUserResponseModel> getRequestsOfAssignment(Long assignmentId) {
//        var request = requestRepository.findByAssignmentId(assignmentId);
        var request = requestRepository.findByAssignmentEntity_IdAndIsDeleted(assignmentId, false);
        var listReturn = new ArrayList<RequestListUserResponseModel>();
        if (!CollectionUtils.isEmpty(request)) {
            request.forEach(item -> listReturn.add(convertEntityToModel(item)));
        }
        return listReturn;
    }

    private RequestListUserResponseModel convertEntityToModel(RequestEntity requestEntity) {
        var res = new RequestListUserResponseModel();
        res.setId(requestEntity.getId());
        res.setRequestId(requestEntity.getRequestId());
        res.setResponseId(requestEntity.getResponseId());
        res.setIsAccepted(requestEntity.getIsAccepted());
        res.setAssignmentId(requestEntity.getAssignmentEntity().getId());
        res.setAssignmentUrl(requestEntity.getAssignmentEntity().getAssignmentUrl());
        res.setDifficultType(requestEntity.getDifficultType().toString());
        res.setPrice(getPrice(requestEntity.getDifficultType()));
        return res;
    }

    public RequestListUserResponseModel createRequestForAssignment(RequestForAssignmentModel requestModel) {
//        var requestEntity = requestRepository.findByAssignmentIdAndResponseId(
//                requestModel.getAssignmentId(), requestModel.getResponseId());
        var requestEntity = requestRepository.findByAssignmentEntity_IdAndResponseId(
                requestModel.getAssignmentId(), requestModel.getResponseId());
        if (!ObjectUtils.isEmpty(requestEntity)) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E404001", "You have request this assignment!!"));
        }
        requestEntity = new RequestEntity();
//        requestEntity.setAssignmentId(requestModel.getAssignmentId());
        requestEntity.setAssignmentEntity(assignmentService.findEntityById(requestModel.getAssignmentId()));

        requestEntity.setResponseId(requestModel.getResponseId());
        requestEntity.setIsAccepted(false);
        requestEntity.setDifficultType(DifficultType.valueOf(requestModel.getDifficultType()));
        requestEntity.setIsDeleted(false);
        requestEntity.setPrice(getPrice(DifficultType.valueOf(requestModel.getDifficultType())));
        var userAss = userAssignmentRepository.findByAssignmentId(requestModel.getAssignmentId());

        requestEntity.setRequestId(userAss.getRequestId());
        var notification = new NotificationEntity();
        notification.setContent(String.format("Teacher %s want to solve this assignment %s",
                userService.getUserInfo(requestModel.getResponseId()).getName(),
                assignmentService.getAssignment(requestModel.getAssignmentId()).getSubject().getName()));
        notification.setIsRead(false);
        notification.setSenderName(userService.getUserInfo(requestModel.getResponseId()).getName());
        notification.setReceiverId(userAss.getRequestId());
        notification.setSenderId(requestModel.getResponseId());
//        notification.setReceiverId(userAss.getRequestId());
        requestEntity.setNotificationEntity(notification);
        var obj = requestRepository.save(requestEntity);

        simpMessagingTemplate.convertAndSend("/user/" + notification.getReceiverId() + "/notify"
                , notificationService.convertEntityToModel(obj.getNotificationEntity()));
        return convertEntityToModel(obj);
    }

    public Boolean isHaveSendRequestSolve(Long assignmentId, Long userId) {
//        var requestEntity = requestRepository.findByAssignmentIdAndResponseId(assignmentId, userId);
        var requestEntity = requestRepository.findByAssignmentEntity_IdAndResponseId(assignmentId, userId);
        return !ObjectUtils.isEmpty(requestEntity);
    }

    public Object acceptRequest(RequestForAssignmentModel requestModel) {
        var ass = assignmentService.findEntityById(requestModel.getAssignmentId());
        if (ObjectUtils.isEmpty(ass)) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E404001", "Not Found Assignment!!"));
        }
        // Set Ass
        ass.setDifficultType(DifficultType.valueOf(requestModel.getDifficultType()));
        assignmentRepository.save(ass);

        // Set Response Id
        var userAss = userAssignmentRepository
                .findByRequestIdAndAssignmentId(requestModel.getRequestId(), requestModel.getAssignmentId());
        userAss.setResponseId(requestModel.getResponseId());
        userAssignmentRepository.save(userAss);

        // Set Request
        var requestList = requestRepository.findByAssignmentEntity_Id(requestModel.getAssignmentId());
        if (!CollectionUtils.isEmpty(requestList)) {
            requestList.forEach(item -> {
                if (item.getResponseId() == requestModel.getResponseId()) {
                    item.setIsAccepted(true);
                    requestRepository.save(item);
                } else {
                    item.setIsDeleted(true);
                    requestRepository.save(item);
                }
            });
        }
        return null;
    }

    public Object rejectRequest(RequestForAssignmentModel requestModel) {
        var ass = assignmentService.findEntityById(requestModel.getAssignmentId());
        if (ObjectUtils.isEmpty(ass)) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E404001", "Not Found Assignment!!"));
        }

        // Set Request
        var requestList = requestRepository.findByAssignmentEntity_Id(requestModel.getAssignmentId());
        if (!CollectionUtils.isEmpty(requestList)) {
            requestList.forEach(item -> {
                if (item.getResponseId() == requestModel.getResponseId()) {
                    item.setIsDeleted(true);
                    requestRepository.save(item);
                }
            });
        }
        return null;
    }

    public Double getPrice (DifficultType type) {
        double value = 0;
        switch (type) {
            case EASY:
                value = 1000;
                break;
            case VERY_EASY:
                value = 2000;
                break;
            case NORMAL:
                value = 3000;
                break;
            case DIFFICULT:
                value = 4000;
                break;
            case VERY_DIFFICULT:
                value = 5000;
                break;
            default:
                break;
        }
        return value;
    }
}
