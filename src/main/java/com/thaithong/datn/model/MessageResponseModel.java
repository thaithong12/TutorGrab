package com.thaithong.datn.model;

import com.thaithong.datn.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponseModel {
    private Long id;

    private Date createdAt;

    private Date updatedAt;

    private Long senderId;

    private Long receiverId;

    private String text;

    private String file;

    @Enumerated(EnumType.STRING)
    private MessageType type;
}
