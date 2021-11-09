package com.thaithong.datn.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class GroupResponseModel {
    private Long id;

    private String name;

    private List<UserResponseModel> users;

    /**
     * administratorId
     */
    private Long userId;

    private AssignmentResponseModel assignment;

    private List<MessageResponseModel> messages;

    private Boolean isClosed;
}
