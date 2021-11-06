package com.thaithong.datn.repository;

import com.thaithong.datn.entity.RoleEntity;
import com.thaithong.datn.entity.UserEntity;
import com.thaithong.datn.enums.AccountRole;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface RoleRepository extends CrudRepository<RoleEntity, Long> {
    RoleEntity findByRole(AccountRole role);
}
