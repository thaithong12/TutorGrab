package com.thaithong.datn.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRequestModel {
    private Long userId;

    private String name;

    private String phoneNumber;

    private String password;

    private String avatar;

    private List<String> roles;

    private Boolean isBlocked;

    private Boolean isAuthorized;

    private String jwt;
}
