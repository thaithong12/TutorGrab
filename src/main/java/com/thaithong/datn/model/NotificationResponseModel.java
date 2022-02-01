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
    private Long senderId;

    private String senderName;

    private Long receiverId;

    private String receiverName;

    private MessageType type;

    private String message;

    private String lastMessageDate;

    private String groupUrl;

    private Long groupId;

    private String fileUrl;

    private String fileName;

    private boolean isMessageSeen;

    private Long requestId;
}
