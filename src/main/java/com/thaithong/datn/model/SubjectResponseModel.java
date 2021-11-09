package com.thaithong.datn.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SubjectResponseModel {
    private Long id;

    private Date createdAt;

    private Date updatedAt;

    private Long createdBy;

    private Long updatedBy;

    private String name;
}
