package com.thaithong.datn.config;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;

import java.util.Optional;

public class CustomAuditorAware  implements AuditorAware<String> {
    @Override
    public Optional<String> getCurrentAuditor() {
        try{
            String loggedName = SecurityContextHolder.getContext().getAuthentication().getName();
            return Optional.of(loggedName);
        } catch (NullPointerException e) {
            return Optional.empty();
        }
    }
}
