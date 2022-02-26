package com.thaithong.datn.service;

import com.thaithong.datn.entity.PaymentEntity;
import com.thaithong.datn.model.PaymentModel;
import com.thaithong.datn.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    public PaymentModel savePayment (PaymentEntity p) {
        return convertEntityToModel(paymentRepository.save(p));
    }

    public List<PaymentEntity> findByAssignmentId (Long id) {
        return paymentRepository.findByAssignment_Id(id);
    }

    public PaymentModel convertEntityToModel (PaymentEntity p) {
        var obj = new PaymentModel();
        obj.setAssignmentId(p.getAssignment().getId());
        obj.setCreditCardId(p.getCreditCard().getId());
        obj.setStatus(p.getStatus());
        obj.setRecipientId(p.getRecipientId());
        obj.setDepositorId(p.getDepositorId());
        return obj;
    }
}
