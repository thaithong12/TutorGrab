package com.thaithong.datn.repository;

import com.thaithong.datn.entity.PaymentEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends CrudRepository<PaymentEntity, Long> {
    public List<PaymentEntity> findByAssignment_Id(Long id);
}
