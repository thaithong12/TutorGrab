package com.thaithong.datn.service;

import com.thaithong.datn.entity.GroupEntity;
import com.thaithong.datn.entity.MessageEntity;
import com.thaithong.datn.enums.MessageType;
import com.thaithong.datn.model.NotificationResponseModel;
import com.thaithong.datn.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private GroupService groupService;

    @Autowired
    private UserService userService;

    public MessageEntity createAndSaveMessage(Long userId, Long groupId, String type, String data) {
        MessageEntity msg = new MessageEntity();
        msg.setSenderId(userId);
        msg.setGroup(groupService.getGroupById(groupId));
        msg.setType(MessageType.valueOf(type));
        msg.setFile(data);
        return messageRepository.save(msg);
    }

    public void updateMessage(MessageEntity msg) {
        messageRepository.save(msg);
    }

    public NotificationResponseModel createNotificationDTO(MessageEntity msg) {
        String groupUrl = groupService.getGroupUrlById(msg.getGroup().getId());
        NotificationResponseModel notificationDTO = new NotificationResponseModel();
        notificationDTO.setGroupId(msg.getGroup().getId());
        notificationDTO.setGroupUrl(groupUrl);
        if (msg.getType().equals(MessageType.TEXT.toString())) {
            notificationDTO.setType(MessageType.TEXT);
            notificationDTO.setMessage(msg.getText());
        }
        if (msg.getType().equals(MessageType.FILE.toString())) {
            //FileEntity fileEntity = fileService.findByFkMessageId(msg.getId());
            notificationDTO.setType(MessageType.FILE);
            notificationDTO.setMessage(msg.getText());
            notificationDTO.setFileUrl(msg.getFile());
        }
        notificationDTO.setSenderId(msg.getSenderId());
        notificationDTO.setLastMessageDate(msg.getCreatedAt().toString());
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
}
