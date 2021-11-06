package com.thaithong.datn.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseModel {
    private Long id;

    private String name;

    private String password;

    private String jwt;

    private String wsToken;

    private List<GroupResponseModel> groupList;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Date expiration_date;

    private String email;

    private boolean isActivated;

    private List<String> roles;

    private Collection<? extends GrantedAuthority> authorities;
}
