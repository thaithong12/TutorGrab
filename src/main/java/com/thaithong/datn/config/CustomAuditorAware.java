package com.thaithong.datn.config;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public class CustomAuditorAware  implements AuditorAware<String> {
    @Override
    public Optional<String> getCurrentAuditor() {
        String loggedName = SecurityContextHolder.getContext().getAuthentication().getName();
        return Optional.of(loggedName);
    }
}
