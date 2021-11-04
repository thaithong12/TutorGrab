package com.thaithong.datn.service;

import com.thaithong.datn.entity.RoleEntity;
import com.thaithong.datn.enums.AccountRole;
import com.thaithong.datn.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public RoleEntity getRole(AccountRole role) {
        return roleRepository.findByRole(role);
    }
}
