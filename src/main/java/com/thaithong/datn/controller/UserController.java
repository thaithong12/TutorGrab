package com.thaithong.datn.controller;

import com.thaithong.datn.model.UserRequestModel;
import com.thaithong.datn.service.UserService;
import com.thaithong.datn.utils.CustomErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

    @GetMapping("/users/teachers")
    private ResponseEntity<?> getAllTeacherUsers() {
        return ResponseEntity.ok(userService.getAllTeacherUsers());
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

    @PostMapping("/upload/message")
    public ResponseEntity<?> uploadFilesOnMessage(@RequestBody MultipartFile[] multipartFile,
                                                  @RequestParam(name = "userId") Long userId,
                                                  @RequestParam(name = "groupUrl") String groupUrl) {
        return userService.processingImageOnMessage(multipartFile, userId, groupUrl);
    }

    @GetMapping(value = "/top-users")
    public ResponseEntity<?> getTopUser() {
        return userService.getTopUser();
    }

    @PostMapping("/upload-ckeditor")
    public ResponseEntity<?> uploadFileCKEditor (@RequestBody MultipartFile[] files) {
        return userService.processingImageCKEditor(files);
    }

    @PutMapping("/users/authorized-user")
    private ResponseEntity<?> updateAuthorizedUser(@RequestBody UserRequestModel requestModel) {
        try {
            userService.updateAuthorizedUser(requestModel);
            return ResponseEntity.ok(userService.getUserInfo(requestModel.getUserId()));
        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(customErrorException.getStatus()).body(customErrorException.getData());
        }
    }
}
