package com.thaithong.datn.repository;

import com.thaithong.datn.entity.NotificationEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends CrudRepository<NotificationEntity, Long> {
    List<NotificationEntity> findByReceiverId(Long receiverId);
}
