package com.thaithong.datn.model;

import lombok.Data;

import java.io.Serializable;

@Data
public class JwtResponseModel implements Serializable {
    private final String jwtToken;
}
