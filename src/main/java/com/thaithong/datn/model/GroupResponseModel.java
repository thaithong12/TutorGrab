package com.thaithong.datn.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupResponseModel {
    private Long id;

    private String url;

    private String name;
}
