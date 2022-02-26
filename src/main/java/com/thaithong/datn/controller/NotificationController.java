package com.thaithong.datn.controller;

import com.thaithong.datn.model.NotificationRequestModel;
import com.thaithong.datn.model.NotificationResponseModel;
import com.thaithong.datn.service.NotificationService;
import com.thaithong.datn.utils.CustomErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api")
@CrossOrigin
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping("/notifications/{userId}")
    public ResponseEntity<?> getAllNotificationOfUser (@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(notificationService.getAllNotificationOfUser(userId));
        } catch (CustomErrorException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getData());
        }
    }

    @PutMapping("/notifications/{notifyId}")
    public ResponseEntity<?> updateNotification (@PathVariable Long notifyId) {
        try {
            return ResponseEntity.ok(notificationService.updateNotification(notifyId));
        } catch (CustomErrorException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getData());
        }
    }

    @PutMapping("notifications")
    public ResponseEntity<?> updateNotificationList (@RequestBody NotificationRequestModel listRequestModel) {
        try {
            return ResponseEntity.ok(notificationService.updateNotificationList(listRequestModel));
        } catch (CustomErrorException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getData());
        }
    }
}
