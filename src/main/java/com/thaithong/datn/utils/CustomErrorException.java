package com.thaithong.datn.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
public class CustomErrorException extends RuntimeException {
    HttpStatus status;

    ErrorObject data;
}

