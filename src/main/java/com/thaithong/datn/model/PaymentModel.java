package com.thaithong.datn.model;

import com.thaithong.datn.entity.AssignmentEntity;
import com.thaithong.datn.entity.CreditCardEntity;
import com.thaithong.datn.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentModel {
    private Long recipientId;

    private Long depositorId;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private Long creditCardId;

    private Long assignmentId;
}
