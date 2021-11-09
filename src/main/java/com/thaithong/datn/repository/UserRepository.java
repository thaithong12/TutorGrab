package com.thaithong.datn.repository;

import com.thaithong.datn.entity.UserEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, Long> {
    UserEntity findByEmail(String email);

    UserEntity findByToken(String token);

    List<UserEntity> findByIsBlocked(Boolean isBlocked);
}
