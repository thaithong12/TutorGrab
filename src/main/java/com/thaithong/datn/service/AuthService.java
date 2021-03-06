package com.thaithong.datn.service;

import com.google.common.base.Strings;
import com.thaithong.datn.config.JwtUtil;
import com.thaithong.datn.entity.CreditCardEntity;
import com.thaithong.datn.entity.NotificationEntity;
import com.thaithong.datn.entity.RoleEntity;
import com.thaithong.datn.entity.UserEntity;
import com.thaithong.datn.enums.AccountRole;
import com.thaithong.datn.model.JwtRequestModel;
import com.thaithong.datn.model.UserModel;
import com.thaithong.datn.model.UserRequestModel;
import com.thaithong.datn.repository.CreditCardRepository;
import com.thaithong.datn.repository.NotificationRepository;
import com.thaithong.datn.repository.UserRepository;
import com.thaithong.datn.utils.CustomErrorException;
import com.thaithong.datn.utils.ErrorObject;
import com.thaithong.datn.utils.StaticVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

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
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender sender;

    @Autowired
    private RoleService roleService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CreditCardRepository cardRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    /**
     * ?????????????????????
     *
     * @param user ??????????????????????????????
     */
    @ExceptionHandler(CustomErrorException.class)
    @Transactional(rollbackFor = {Exception.class, CustomErrorException.class})
    public ResponseEntity<?> register(JwtRequestModel user) {
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

            // create credit card
            var cardEntity = new CreditCardEntity();
            cardEntity.setBalance(1000.0);
            cardEntity.setCardNumber(UUID.randomUUID().toString());
            cardEntity.setExpDate(generateExpirationDate());
            cardRepository.save(cardEntity);

            // set role
            if (user.getRole().equals(AccountRole.ROLE_TEACHER.name())) {
                entity.setIsAuthorized(false);
                entity.setIdentification(user.getIdentification());
                entity.setStudentCard(user.getStudentCard());
                entity.setCollegeDegree(user.getCollegeDegree());
            }
            var roleEntities = new ArrayList<RoleEntity>();
            var role = roleService.getRole(AccountRole.valueOf(user.getRole()));
            roleEntities.add(role);
            entity.setAccountRoles(roleEntities);
            entity.setCreditCardEntity(cardEntity);
            var userTemp = userRepository.save(entity);

            if (role.getRole().equals(AccountRole.ROLE_TEACHER)) {
                // send notification to admin if user role teacher
                var adminList = userRepository.findByAccountRoles_Role(AccountRole.ROLE_ADMIN);
                var listNotify = new ArrayList<NotificationEntity>();
                for (var u : adminList) {
                    var notify = new NotificationEntity();
                    notify.setIsRead(false);
                    notify.setSenderName(entity.getName());
                    notify.setSenderId(userTemp.getId());
                    notify.setReceiverId(u.getId());
                    notify.setReceiverName(u.getName());
                    notify.setContent("You have 1 requirement to activate your account.");
                    listNotify.add(notify);
                    simpMessagingTemplate.convertAndSend("/user/" + u.getId() + "/notify", notify);
                }
                notificationRepository.saveAll(listNotify);
            }

            // create token active account
            // send email
            sendEmailWithToken(entity.getEmail(), tokenActiveAccount(userService.findByEmail(user.getEmail())), "Complete Registration!");
            return new ResponseEntity<>(HttpStatus.CREATED);

        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(customErrorException.getData());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * @param authenticationRequest ?????????????????????
     * @param response              ???????????????
     * @return ?????????????????????
     */
    @Transactional(rollbackFor = {Exception.class, CustomErrorException.class})
    public ResponseEntity<?> createAuthenticationToken(JwtRequestModel authenticationRequest,
                                                       HttpServletResponse response) {
        try {
            var user = userService.findByEmail(authenticationRequest.getEmail());
            authenticate(authenticationRequest.getEmail(), authenticationRequest.getPassword(), user);
            checkIsAuthorizedAndIsActivated(user);
            var userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getEmail());
            var token = jwtTokenUtil.generateToken(getUserModel(userDetails, user));
            var jwtAuthToken = new Cookie(StaticVariable.SECURE_COOKIE, token);
            jwtAuthToken.setHttpOnly(true);
            jwtAuthToken.setSecure(false);
            jwtAuthToken.setPath("/");
            // cookie.setDomain("http://localhost");
            // 7 days
            jwtAuthToken.setMaxAge(7 * 24 * 60 * 60);
            response.addCookie(jwtAuthToken);
            user.setJwt(token);
            user.setTokenExpDate(generateExpirationDate());
            userService.saveUser(user);
            return ResponseEntity.status(HttpStatus.OK).body(userMapper.toUserResponseModel(user));
        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(customErrorException.getData());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    private void checkIsAuthorizedAndIsActivated(UserEntity u) {
        if (!u.getIsActivated()) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E400000", "Account is not activated"));
        }
        if (u.getAccountRoles().get(0).getRole().equals(AccountRole.ROLE_TEACHER) && !u.getIsAuthorized()) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E400000", "Account is not authorized, pls wait!"));
        }
    }

    private UserModel getUserModel(UserDetails userDetails, UserEntity userEntity) {
        var userModel = new UserModel();
        userModel.setUserId(userEntity.getId());
        userModel.setUsername(userDetails.getUsername());
        userModel.setPassword(userDetails.getPassword());
        userModel.setAuthorities(userDetails.getAuthorities());
        var roles = userEntity.getAccountRoles()
                .stream()
                .map(RoleEntity::getRole)
                .collect(Collectors.toList());
        userModel.setRoles(roles);
        return userModel;
    }

    private void authenticate(String username, String password, UserEntity userEntity) {
        try {
            if (Objects.isNull(userEntity) || !userEntity.getIsActivated()) {
                throw new CustomErrorException(HttpStatus.BAD_REQUEST, new ErrorObject("E400001",
                        "User is not exist or is not activated"));
            }
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException | BadCredentialsException e) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST, new ErrorObject("E400001", e.getMessage()));
        }
    }

    /**
     * @param token ????????????
     * @return ??????????????????????????????
     */
    @Transactional(rollbackFor = {Exception.class, CustomErrorException.class})
    public ResponseEntity<?> activeAccount(String token) {
        if (!Strings.isNullOrEmpty(token)) {
            var ac = userService.findByToken(token);
            if (!ObjectUtils.isEmpty(ac)) {
                var cur = new Date();
                var last = ac.getTokenExpDate();
                if (last.before(cur) || last.equals(cur)) {
                    ac.setToken(tokenActiveAccount(ac));
                    sendEmailWithToken(ac.getEmail(), ac.getToken(), "Re-Send Token!");
                    return ResponseEntity.status(HttpStatus.OK).body(new ErrorObject("200", "Re-Send Token"));
                } else {
                    //ac.setToken(null);
                    ac.setIsActivated(true);
                }
                userService.saveUser(ac);
                return ResponseEntity.status(HttpStatus.OK).body(null);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorObject("E404001", "Token is not exist"));
            }

        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorObject("E404001", "Token is not exist"));
        }
    }

    /**
     * ???????????????????????????????????????
     *
     * @param email ?????????????????????
     * @param token ???????????????
     */
    private void sendEmailWithToken(String email, String token, String subject) {
        var mailMessage = new SimpleMailMessage();
        mailMessage.setTo(email);
        mailMessage.setSubject(String.format("%s", subject));
        mailMessage.setText("To confirm your account, please click here : "
                + "http://localhost:3000/active-account/" + token);
        sender.send(mailMessage);
    }

    /**
     * ???date1???date2?????????????????????
     *
     * @param date1    ????????????
     * @param date2    ???????????????
     * @param timeUnit ???????????????
     * @return date1???date2????????????
     */
    public long getDateDiff(Date date1, Date date2, TimeUnit timeUnit) {
        long diffInMillies = date2.getTime() - date1.getTime();
        return timeUnit.convert(diffInMillies, TimeUnit.MILLISECONDS);
    }

    /**
     * ????????????????????????
     *
     * @param ac ?????????????????????????????????
     * @return ??????????????????????????????????????????
     */
    private String tokenActiveAccount(UserEntity ac) {
        ac.setTokenExpDate(generateExpirationDate());
        var token_gen = UUID.randomUUID().toString();
        ac.setToken(token_gen);
        userService.saveUser(ac);
        return token_gen;
    }

    /**
     * ???????????????????????????
     *
     * @return ??????????????????
     */
    public Date generateExpirationDate() {
        return new Date(System.currentTimeMillis() + 864000000);
    }

    /**
     * ?????????????????????
     *
     * @param model ???????????????????????????
     */
    private void validationUser(JwtRequestModel model) {
        if (model.getEmail() == null || model.getEmail().isEmpty() || model.getEmail().isBlank())
            throw new CustomErrorException(HttpStatus.BAD_REQUEST, new ErrorObject("E400001", "email can not be null"));
        if (model.getPassword() == null || model.getPassword().isEmpty() || model.getPassword().isBlank())
            throw new CustomErrorException(HttpStatus.BAD_REQUEST, new ErrorObject("E400001", "password can not be null"));
        if (model.getPhoneNumber() == null || model.getPhoneNumber().isEmpty() || model.getPhoneNumber().isBlank())
            throw new CustomErrorException(HttpStatus.BAD_REQUEST, new ErrorObject("E400001", "phonenumber can not be null"));
    }

    public ResponseEntity<?> fetchUser(UserRequestModel authorizationHeader) {
        UserModel user = null;
        if (StringUtils.hasText(authorizationHeader.getJwt()) && authorizationHeader.getJwt().startsWith("Token ")) {
            String jwt = authorizationHeader.getJwt().substring(6);
            user = jwtUtil.getUserFromToken(jwt);
            if (!ObjectUtils.isEmpty(user)) {
                var entity = userService.findById(user.getUserId());
                return ResponseEntity.ok(userMapper.toUserResponseModel(entity));
            }
        }
        return ResponseEntity.ok(user);
    }
}


