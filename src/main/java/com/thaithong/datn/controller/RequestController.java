package com.thaithong.datn.controller;

import com.thaithong.datn.model.RequestForAssignmentModel;
import com.thaithong.datn.service.RequestService;
import com.thaithong.datn.utils.CustomErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api")
@CrossOrigin
public class RequestController {
    @Autowired
    private RequestService requestService;

    @GetMapping("/requests/{userId}")
    public ResponseEntity<?> getRequestsOfUser (@PathVariable Long userId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(requestService.getRequestsOfUser(userId));
        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(customErrorException.getStatus()).body(customErrorException.getData());
        }
    }

    @GetMapping("/requests/{assignmentId}")
    public ResponseEntity<?> getRequestsOfAssignment (@PathVariable Long assignmentId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(requestService.getRequestsOfAssignment(assignmentId));
        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(customErrorException.getStatus()).body(customErrorException.getData());
        }
    }

    @GetMapping("/requests/{assignmentId}/{userId}")
    private ResponseEntity<?> isHaveSendRequestSolve (@PathVariable Long assignmentId, @PathVariable Long userId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(requestService.isHaveSendRequestSolve(assignmentId, userId));
        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(customErrorException.getStatus()).body(customErrorException.getData());
        }
    }

    @PostMapping("/requests")
    public ResponseEntity<?> createRequestForAssignment (@RequestBody RequestForAssignmentModel requestModel) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(requestService.createRequestForAssignment(requestModel));
        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(customErrorException.getStatus()).body(customErrorException.getData());
        }
    }
}
