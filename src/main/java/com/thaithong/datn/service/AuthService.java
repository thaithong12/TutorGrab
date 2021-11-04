package com.thaithong.datn.service;

import com.thaithong.datn.config.JwtUtil;
import com.thaithong.datn.entity.RoleEntity;
import com.thaithong.datn.entity.UserEntity;
import com.thaithong.datn.enums.AccountRole;
import com.thaithong.datn.model.JwtRequestModel;
import com.thaithong.datn.utils.CustomErrorException;
import com.thaithong.datn.utils.ErrorObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Date;
import java.util.HashSet;
import java.util.UUID;

@Service
public class AuthService {

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
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender sender;

    @Autowired
    private RoleService roleService;

    @ExceptionHandler(CustomErrorException.class)
    @Transactional(rollbackFor = {Exception.class, CustomErrorException.class})
    public ResponseEntity<?> register (JwtRequestModel user) {
        try {
            validationUser(user);
            UserEntity checkExist = userService.findByEmail(user.getEmail());
            if (null != checkExist) {
                throw new CustomErrorException(HttpStatus.BAD_REQUEST, new ErrorObject("E400003", "email is existed"));
            }

            var entity = new UserEntity();

            // set info
            entity.setEmail(user.getEmail());
            entity.setPassword(passwordEncoder.encode(user.getPassword()));
            entity.setIsActivated(false);
            entity.setPhoneNumber(user.getPhoneNumber());
            entity.setName(user.getName());

            // set role
            if (user.getRole().equals(AccountRole.ROLE_STUDENT.name())) {
                entity.setIsAuthorized(false);
            }
            var roleEntities = new HashSet<RoleEntity>();
            var role = roleService.getRole(AccountRole.valueOf(user.getRole()));
            roleEntities.add(role);
            entity.setAccountRoles(roleEntities);
            userService.saveUser(entity);

            // create token active account
            // send email
            var mailMessage = new SimpleMailMessage();
            mailMessage.setTo(entity.getEmail());
            mailMessage.setSubject("Complete Registration!");
            mailMessage.setText("To confirm your account, please click here : "
                    + "http://localhost/api/confirm-account?token="
                    + tokenActiveAccount(userService.findByEmail(user.getEmail())));
            sender.send(mailMessage);
            return new ResponseEntity<>(HttpStatus.OK);

        }catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(customErrorException.getData());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    private String tokenActiveAccount(UserEntity ac) {
        ac.setTokenExpDate(generateExpirationDate());
        var token_gen = UUID.randomUUID().toString();
        ac.setToken(token_gen);
        userService.saveUser(ac);
        return token_gen;
    }

    private Date generateExpirationDate() {
        return new Date(System.currentTimeMillis() + 864000000);
    }

    private void validationUser (JwtRequestModel model) {
        if (model.getEmail() == null || model.getEmail().isEmpty() || model.getEmail().isBlank())
            throw new CustomErrorException(HttpStatus.BAD_REQUEST, new ErrorObject("E400001", "email can not be null"));
        if (model.getPassword() == null || model.getPassword().isEmpty() || model.getPassword().isBlank())
            throw new CustomErrorException(HttpStatus.BAD_REQUEST, new ErrorObject("E400001", "password can not be null"));
        if (model.getPhoneNumber() == null || model.getPhoneNumber().isEmpty()|| model.getPhoneNumber().isBlank())
            throw new CustomErrorException(HttpStatus.BAD_REQUEST, new ErrorObject("E400001", "phonenumber can not be null"));
    }
}
