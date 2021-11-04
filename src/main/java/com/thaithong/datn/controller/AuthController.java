package com.thaithong.datn.controller;

import com.thaithong.datn.config.JwtUtil;
import com.thaithong.datn.model.JwtRequestModel;
import com.thaithong.datn.model.UserResponseModel;
import com.thaithong.datn.service.AuthService;
import com.thaithong.datn.service.CustomUserDetailsService;
import com.thaithong.datn.service.GroupService;
import com.thaithong.datn.service.UserMapper;
import com.thaithong.datn.service.UserService;
import com.thaithong.datn.utils.StaticVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(value = "/api/auth")
@CrossOrigin
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtTokenUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserService userService;

    @Autowired
    private GroupService groupService;

    @Autowired
    private AuthService authService;

    @PostMapping(value = "/login")
    public UserResponseModel createAuthenticationToken(@RequestBody JwtRequestModel authenticationRequest, HttpServletResponse response) throws Exception {
        authenticate(authenticationRequest.getEmail(), authenticationRequest.getPassword());
        var userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getEmail());
        var user = userService.findByEmail(authenticationRequest.getEmail());
        var token = jwtTokenUtil.generateToken(userDetails);
        var jwtAuthToken = new Cookie(StaticVariable.SECURE_COOKIE, token);
        jwtAuthToken.setHttpOnly(true);
        jwtAuthToken.setSecure(false);
        jwtAuthToken.setPath("/");
        // cookie.setDomain("http://localhost");
        // 7 days
        jwtAuthToken.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(jwtAuthToken);
        return userMapper.toUserResponseModel(user);
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody JwtRequestModel user){
        return authService.register(user);
    }

}
