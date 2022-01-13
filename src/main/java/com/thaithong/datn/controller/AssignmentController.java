package com.thaithong.datn.controller;

import com.thaithong.datn.enums.DifficultType;
import com.thaithong.datn.model.AssignmentRequestModel;
import com.thaithong.datn.service.AssignmentService;
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

import java.util.Arrays;

@RestController
@RequestMapping(value = "/api")
@CrossOrigin
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @GetMapping("/assignments")
    public ResponseEntity<?> getAllAssignment() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    @GetMapping("/assignments/user/{id}/{who}")
    public ResponseEntity<?> getAllAssignmentOfUser(@PathVariable Long id, @PathVariable String who) {
        return ResponseEntity.ok(assignmentService.getAssignmentByAnsweredIdOrPutterId(id, who));
    }

    @GetMapping("/assignments/{id}")
    public ResponseEntity<?> getAssignment(@PathVariable Long id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(assignmentService.getAssignment(id));
        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(customErrorException.getStatus()).body(customErrorException.getData());
        }
    }

    @PutMapping("/assignments/{id}")
    public ResponseEntity<?> updateAssignment(@PathVariable Long id, @RequestBody AssignmentRequestModel requestModel) {
        try {
            return ResponseEntity.ok(assignmentService.updateAssignment(id, requestModel));
        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(customErrorException.getStatus()).body(customErrorException.getData());
        }
    }

    @PostMapping("/assignments")
    public ResponseEntity<?> createAssigment(@RequestBody AssignmentRequestModel requestModel) {
        try {
            assignmentService.createAssignment(requestModel);
            return ResponseEntity.status(HttpStatus.CREATED).body(null);
        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(customErrorException.getStatus()).body(customErrorException.getData());
        }
    }

    @DeleteMapping("/assignments/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        try {
            assignmentService.deleteAssignment(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(customErrorException.getStatus()).body(customErrorException.getData());
        }
    }

    @GetMapping("/assignments/published")
    public ResponseEntity<?> getAllPublishedAssignment() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(assignmentService.getAllPublishedAssignment());
        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(customErrorException.getStatus()).body(customErrorException.getData());
        }
    }

    @GetMapping("/assignments/todo")
    public ResponseEntity<?> getAllTodoAssignment() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(assignmentService.getAllTodoAssignment());
        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(customErrorException.getStatus()).body(customErrorException.getData());
        }
    }

    @GetMapping("/assignments/level")
    public ResponseEntity<?> getDifficultLevel() {
        return ResponseEntity.ok(Arrays.asList(DifficultType.values()));
    }

    @PutMapping("/assignments/{id}/answer")
    public ResponseEntity<?> updateAnswerAssignment(@PathVariable Long id, @RequestBody AssignmentRequestModel requestModel) {
        try {
            return ResponseEntity.ok(assignmentService.updateAnswerAssignment(id, requestModel));
        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(customErrorException.getStatus()).body(customErrorException.getData());
        }
    }

}
