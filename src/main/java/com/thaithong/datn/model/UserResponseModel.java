package com.thaithong.datn.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseModel {
    private Long id;

    private String name;

    private String password;

    private String phoneNumber;

    private String jwt;

    private String wsToken;

    private String avatar;

    private List<GroupResponseModel> groupList;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Date expiration_date;

    private String email;

    private Boolean isActivated;

    private Boolean isAuthorized;

    private String identification;

    private String studentCard;

    private String collegeDegree;

    private Date createdAt;

    private Boolean isBlocked;

    private List<String> roles;

    private Collection<? extends GrantedAuthority> authorities;
}
