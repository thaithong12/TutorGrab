package com.thaithong.datn.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "notifications")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class NotificationEntity extends BaseEntity {
    @Column(name = "sender_id")
    private Long senderId;

    @Column(name = "sender_name")
    private String senderName;

    @Column(name = "receiver_id")
    private Long receiverId;

    @Column(name = "receiver_name")
    private String receiverName;

    private String type;

    private String content;

    @Column(name = "is_read")
    private Boolean isRead;

    @OneToOne(mappedBy = "notificationEntity")
    private RequestEntity requestEntity;
}
