package com.thaithong.datn.controller;

import com.thaithong.datn.model.UserRequestModel;
import com.thaithong.datn.service.UserService;
import com.thaithong.datn.utils.CustomErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(value = "/api")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/users")
    private ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/is-blocked")
    private ResponseEntity<?> getAllUsersIsBlocked() {
        return ResponseEntity.ok(userService.findByIsBlocked(true));
    }

    @GetMapping("/users/{id}")
    private ResponseEntity<?> getUser(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.getUserInfo(id));
        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(customErrorException.getStatus()).body(customErrorException.getData());
        }
    }

    @PutMapping("/users/{id}")
    private ResponseEntity<?> updateUserInfo(@PathVariable Long id, @RequestBody UserRequestModel requestModel) {
        try {
            userService.updateUserInfo(id, requestModel);
            return ResponseEntity.ok(userService.getUserInfo(id));
        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(customErrorException.getStatus()).body(customErrorException.getData());
        }
    }

    @PutMapping("/users/{id}/admin")
    private ResponseEntity<?> updateUserInfoByAdmin(@PathVariable Long id, @RequestBody UserRequestModel requestModel) {
        try {
            userService.updateUserRoleByAdmin(id, requestModel);
            return ResponseEntity.ok(userService.getUserInfo(id));
        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(customErrorException.getStatus()).body(customErrorException.getData());
        }
    }

    @DeleteMapping("/users/{id}/admin")
    private ResponseEntity<?> deleteUserInfoByAdmin(@PathVariable Long id) {
        try {
            userService.deleteOrOpenUserByAdmin(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(customErrorException.getStatus()).body(customErrorException.getData());
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFiles(@RequestBody MultipartFile[] multipartFile) {
        return userService.processingImage(multipartFile);
    }

    @GetMapping(value = "/top-users")
    public ResponseEntity<?> getTopUser() {
        return userService.getTopUser();
    }
}
