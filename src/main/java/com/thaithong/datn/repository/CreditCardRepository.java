package com.thaithong.datn.repository;

import com.thaithong.datn.entity.CreditCardEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CreditCardRepository extends CrudRepository<CreditCardEntity, Long> {

}
