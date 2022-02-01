package com.thaithong.datn.model;

import com.thaithong.datn.enums.TransportAction;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InputTransportRequestModel {
    private int userId;

    private TransportAction action;

    private String wsToken;

    private String groupUrl;

    private String message;

    private int messageId;
}
