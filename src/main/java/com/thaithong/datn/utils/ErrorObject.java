package com.thaithong.datn.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

@AllArgsConstructor
public class ErrorObject {
    private String code;

    private String message;
}