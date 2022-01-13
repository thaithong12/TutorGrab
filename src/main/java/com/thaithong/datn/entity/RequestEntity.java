package com.thaithong.datn.entity;

import lombok.*;

import javax.persistence.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "requests")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RequestEntity extends BaseEntity{
    @Column(name = "request_id")
    private Long requestId;

    @Column(name = "response_id")
    private Long responseId;

    @Column(name = "assignment_id")
    private Long assignmentId;

    @Column(name = "is_accepted")
    private Boolean isAccepted;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "notification_id", referencedColumnName = "id")
    private NotificationEntity notificationEntity;
}
