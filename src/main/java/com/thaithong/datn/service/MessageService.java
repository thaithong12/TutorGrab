package com.thaithong.datn.service;

import com.thaithong.datn.entity.GroupEntity;
import com.thaithong.datn.entity.MessageEntity;
import com.thaithong.datn.entity.NotificationEntity;
import com.thaithong.datn.enums.MessageType;
import com.thaithong.datn.model.InputTransportRequestModel;
import com.thaithong.datn.model.NotificationResponseModel;
import com.thaithong.datn.repository.MessageRepository;
import com.thaithong.datn.utils.CustomErrorException;
import com.thaithong.datn.utils.ErrorObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private GroupService groupService;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Transactional
    public MessageEntity createAndSaveMessage(InputTransportRequestModel dto) {
        MessageEntity msg = new MessageEntity();
        msg.setSenderId(dto.getSenderId());
        msg.setReceiverId(dto.getReceiverId());
        msg.setGroup(groupService.getGroupById(dto.getGroupId()));
        msg.setType(MessageType.valueOf(dto.getType()));
        if (StringUtils.hasText(dto.getFileName())) {
            msg.setFile(dto.getFileName());
            msg.setType(MessageType.IMAGE);
        }
        msg.setText(dto.getMessage());
        return messageRepository.save(msg);
    }

    public void updateMessage(MessageEntity msg) {
        messageRepository.save(msg);
    }

    public NotificationResponseModel createNotificationDTO(MessageEntity msg) {
        NotificationResponseModel notificationDTO = new NotificationResponseModel();
        notificationDTO.setGroupId(msg.getGroup().getId());
        if (msg.getType().equals(MessageType.TEXT)) {
            notificationDTO.setType(MessageType.TEXT);
            notificationDTO.setMessage(msg.getText());
        }
        if (msg.getType().equals(MessageType.FILE)) {
            notificationDTO.setType(MessageType.FILE);
            notificationDTO.setMessage(msg.getText());
        }
        notificationDTO.setSenderId(msg.getSenderId());
        notificationDTO.setSenderName(userService.findFirstNameById(msg.getSenderId()));
        notificationDTO.setMessageSeen(false);
        return notificationDTO;
    }

    public List<Long> createNotificationList(Long userId, String groupUrl) {
        Long groupId = groupService.findGroupByUrl(groupUrl);
        List<Long> toSend = new ArrayList<>();
        Optional<GroupEntity> optionalGroupEntity = groupService.findById(groupId);
        if (optionalGroupEntity.isPresent()) {
            GroupEntity groupEntity = optionalGroupEntity.get();
            groupEntity.getUsers().forEach(userEntity -> toSend.add(userEntity.getId()));
        }
        return toSend;
    }

    public void saveAndSendMessage(InputTransportRequestModel dto) {
        if (!ObjectUtils.isEmpty(dto)) {
            if (Objects.equals(dto.getType(), MessageType.TEXT.toString())) {
                var msg = createAndSaveMessage(dto);
                if (ObjectUtils.isEmpty(msg))
                    throw new CustomErrorException(
                            HttpStatus.BAD_REQUEST,
                            new ErrorObject("E400001", "save msg error!"));
                simpMessagingTemplate.convertAndSend(
                        "/user/" + dto.getGroupUrl() + "/reply",
                        groupService.convertMessageEntityToModel(msg));

                var senderInfo = userService.getUserInfo(dto.getSenderId());
                var notification = new NotificationEntity();
                notification.setIsRead(false);
                notification.setContent(String.format("User %s has sent you a message.",
                        senderInfo.getName()));
                notification.setSenderName(senderInfo.getName());
                notification.setReceiverId(dto.getReceiverId());
                var temp = notificationService.saveNotify(notification);
                simpMessagingTemplate.convertAndSend("/user/" + dto.getReceiverId() + "/reply", temp);
            }
        }
    }
}
