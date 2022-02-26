package com.thaithong.datn.controller;

import com.thaithong.datn.enums.TransportAction;
import com.thaithong.datn.model.InputTransportRequestModel;
import com.thaithong.datn.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class MessageController {
    @Autowired
    private MessageService messageService;

    @MessageMapping("/message")
    public void mainChannel(InputTransportRequestModel dto, @Header("simpSessionId") String sessionId) {
        TransportAction action = dto.getAction();
        switch (action) {
            case SEND_GROUP_MESSAGE:
                messageService.saveAndSendMessage(dto);
                break;
            default:
                break;
        }
    }
}
