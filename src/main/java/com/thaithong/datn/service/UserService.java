package com.thaithong.datn.service;

import com.thaithong.datn.entity.UserEntity;
import com.thaithong.datn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public void saveUser(UserEntity u) {
        userRepository.save(u);
    }

    public UserEntity findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public UserEntity findByToken (String token) {
        return userRepository.findByToken(token);
    }
}
