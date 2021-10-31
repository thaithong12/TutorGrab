package com.thaithong.datn.entity;

import com.thaithong.datn.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "payments")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaymentEntity extends BaseEntity {
    @Column(name = "recipient_id")
    private Long recipientId;

    @Column(name = "depositor_id")
    private Long depositorId;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @ManyToOne
    @JoinColumn(name = "credit_card_id")
    private CreditCardEntity creditCard;

    @ManyToOne
    @JoinColumn(name = "assignment_id")
    private AssignmentEntity assignment;
}
