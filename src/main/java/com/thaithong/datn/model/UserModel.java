package com.thaithong.datn.model;

import com.thaithong.datn.enums.AccountRole;
import lombok.Data;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
public class UserModel implements UserDetails {

    private String username;

    private Long userId;

    private String password;

    private Collection authorities;

    private List<AccountRole> roles;

    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    @Override
    public boolean isAccountNonLocked() {
        return false;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @Override
    public boolean isEnabled() {
        return false;
    }
}
