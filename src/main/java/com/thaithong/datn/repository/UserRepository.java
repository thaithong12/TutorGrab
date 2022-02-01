package com.thaithong.datn.repository;

import com.thaithong.datn.entity.UserEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, Long> {
    UserEntity findByEmail(String email);

    UserEntity findByToken(String token);

    List<UserEntity> findByIsBlocked(Boolean isBlocked);

    @Query(value = "SELECT u.email FROM users u WHERE u.token = :token", nativeQuery = true)
    String getUsernameWithWsToken(@Param(value = "token") String token);

    @Query(value = "SELECT u.id FROM users u WHERE u.token = :token", nativeQuery = true)
    int getUserIdWithWsToken(@Param(value = "token") String token);

    @Query(value = "SELECT u.email FROM users u WHERE u.id = :userId", nativeQuery = true)
    String getNameByUserId(@Param(value = "userId") Long id);
}
