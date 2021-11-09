package com.thaithong.datn.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@AllArgsConstructor
public class CustomErrorException extends RuntimeException {
    HttpStatus status;

    ErrorObject data;
}

