package com.thaithong.datn.controller;

import com.thaithong.datn.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api")
@CrossOrigin
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @GetMapping(value = "/subjects")
    public ResponseEntity<?> getAllSubject () {
        return ResponseEntity.ok(subjectService.getAllSubjects ());
    }
}
