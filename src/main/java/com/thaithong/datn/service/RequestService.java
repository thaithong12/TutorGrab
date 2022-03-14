package com.thaithong.datn.service;

import com.thaithong.datn.entity.*;
import com.thaithong.datn.enums.DifficultType;
import com.thaithong.datn.enums.PaymentStatus;
import com.thaithong.datn.model.RequestForAssignmentModel;
import com.thaithong.datn.model.RequestListUserResponseModel;
import com.thaithong.datn.repository.AssignmentRepository;
import com.thaithong.datn.repository.CreditCardRepository;
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

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

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

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private CreditCardRepository cardRepository;

    @Autowired
    private GroupService groupService;

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

    @Transactional(rollbackOn = {Exception.class, CustomErrorException.class})
    public Object acceptRequest(RequestForAssignmentModel requestModel) {
        var ass = assignmentService.findEntityById(requestModel.getAssignmentId());
        if (ObjectUtils.isEmpty(ass)) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E404001", "Not Found Assignment!!"));
        }
        // Set Ass
        Double price = getPrice(DifficultType.valueOf(requestModel.getDifficultType()));
        ass.setDifficultType(DifficultType.valueOf(requestModel.getDifficultType()));
        ass.setPrice(price);
        assignmentRepository.save(ass);

        var depositor = userService.findById(requestModel.getRequestId());

        // deduct money from the account.
        var card = depositor.getCreditCardEntity();
        if (price > card.getBalance() || card.getBalance() == 0) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E400001", "Not enough money!!!Pls top up."));
        } else {
            var newBalance = card.getBalance() - price;
            card.setBalance(newBalance);
            cardRepository.save(card);
        }
        // send money to admin account
        var cardAdmin = userService.findByEmail("102170302@sv2.dut.edu.vn").getCreditCardEntity();
        if (ObjectUtils.isEmpty(cardAdmin)) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E400001", "Admin Card cannot get !!!"));
        } else {
            cardAdmin.setBalance(cardAdmin.getBalance() + price);
            cardRepository.save(cardAdmin);
        }
        // create new payment
        var payment = new PaymentEntity();
        payment.setAssignment(ass);
        payment.setRecipientId(requestModel.getResponseId());
        payment.setDepositorId(requestModel.getRequestId());
        payment.setStatus(PaymentStatus.PROCESSING);
        if (!ObjectUtils.isEmpty(depositor.getCreditCardEntity())) {
            payment.setCreditCard(depositor.getCreditCardEntity());
        }
        paymentService.savePayment(payment);

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

        var userList = new ArrayList<UserEntity>();
        userList.add(userService.findById(userAss.getRequestId()));
        userList.add(userService.findById(userAss.getResponseId()));
        // create new chat group
        var groupEntity = new GroupEntity();
        groupEntity.setIsClosed(false);
        groupEntity.setAssignmentEntity(ass);
        groupEntity.setUrl("");
        groupEntity.setName("");
        groupEntity.setUsers(userList);
        groupEntity.setUserId(userAss.getRequestId());
        groupEntity.setUrl(UUID.randomUUID().toString());
        var requestUser = userService.findById(requestModel.getRequestId());
        var responseUser = userService.findById(requestModel.getResponseId());
        var listUsers = new ArrayList<UserEntity>();
        listUsers.add(requestUser);
        listUsers.add(responseUser);
        groupEntity.setUsers(listUsers);

        var tempGroup = groupService.saveGroup(groupEntity);
        var tempGroupRequestUser = requestUser.getGroups();
        var tempGroupResponseUser = responseUser.getGroups();
        if (CollectionUtils.isEmpty(tempGroupRequestUser)) {
            var groups = new ArrayList<GroupEntity>();
            groups.add(tempGroup);
            requestUser.setGroups(groups);
        } else {
            tempGroupRequestUser.add(tempGroup);
        }
        if (CollectionUtils.isEmpty(tempGroupResponseUser)) {
            var groups = new ArrayList<GroupEntity>();
            groups.add(tempGroup);
            responseUser.setGroups(groups);
        } else {
            tempGroupResponseUser.add(tempGroup);
        }
        userService.saveUser(requestUser);
        userService.saveUser(responseUser);

        // send notification
        var notificationEntity = new NotificationEntity();
        notificationEntity.setReceiverId(responseUser.getId());
        notificationEntity.setSenderId(requestUser.getId());
        notificationEntity.setIsRead(false);
        notificationEntity.setContent("Assignment #" + ass.getAssignmentUrl() + " is accepted!");
        var tempNotify = notificationService.saveNotify(notificationEntity);
        simpMessagingTemplate.convertAndSend("/user/" + notificationEntity.getReceiverId() + "/notify", tempNotify);

        return null;
    }

    public Object rejectRequest(RequestForAssignmentModel requestModel) {
        var ass = assignmentService.findEntityById(requestModel.getAssignmentId());
        if (ObjectUtils.isEmpty(ass)) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E404001", "Not Found Assignment!!"));
        }

        // Set Request
        AtomicReference<RequestEntity> temp = null;
        var requestList = requestRepository.findByAssignmentEntity_Id(requestModel.getAssignmentId());
        if (!CollectionUtils.isEmpty(requestList)) {
            requestList.forEach(item -> {
                if (item.getResponseId() == requestModel.getResponseId()) {
                    item.setIsDeleted(true);
                    requestRepository.save(item);
                    temp.set(item);
                }
            });
        }

        if (temp != null) {
            // send notification
            var notificationEntity = new NotificationEntity();
            notificationEntity.setReceiverId(temp.get().getResponseId());
            notificationEntity.setSenderId(temp.get().getRequestId());
            notificationEntity.setIsRead(false);
            notificationEntity.setContent("Request for assignment #" + ass.getAssignmentUrl() + " is rejected!");
            var tempNotify = notificationService.saveNotify(notificationEntity);
            simpMessagingTemplate.convertAndSend("/user/" + notificationEntity.getReceiverId() + "/notify", tempNotify);
        }

        return null;
    }

    public Double getPrice(DifficultType type) {
        double value = 0;
        switch (type) {
            case VERY_EASY:
                value = 1000;
                break;
            case EASY:
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
