package com.thaithong.datn.model;

import com.thaithong.datn.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponseModel {
    private Long notificationId;

    private Long senderId;

    private String senderName;

    private MessageType type;

    private String message;

    private Long groupId;

    private boolean isMessageSeen;

    private Long requestId;
}
