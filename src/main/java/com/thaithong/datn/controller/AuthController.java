package com.thaithong.datn.controller;

import com.thaithong.datn.model.JwtRequestModel;
import com.thaithong.datn.model.UserResponseModel;
import com.thaithong.datn.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(value = "/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping(value = "/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequestModel authenticationRequest, HttpServletResponse response) throws Exception {
        return authService.createAuthenticationToken(authenticationRequest, response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody JwtRequestModel user){
        return authService.register(user);
    }

    @GetMapping("/active-account")
    public ResponseEntity<?> activeAccount(@RequestParam String token){
        return authService.activeAccount(token);
    }

}
