package com.thaithong.datn.service;

import com.thaithong.datn.entity.RoleEntity;
import com.thaithong.datn.entity.UserAssignment;
import com.thaithong.datn.entity.UserEntity;
import com.thaithong.datn.enums.AccountRole;
import com.thaithong.datn.model.UserAssignmentResponseModel;
import com.thaithong.datn.model.UserRequestModel;
import com.thaithong.datn.model.UserResponseModel;
import com.thaithong.datn.repository.UserAssignmentRepository;
import com.thaithong.datn.repository.UserRepository;
import com.thaithong.datn.utils.CustomErrorException;
import com.thaithong.datn.utils.ErrorObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleService roleService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserAssignmentRepository userAssignmentRepository;

    public void saveUser(UserEntity u) {
        userRepository.save(u);
    }

    public UserEntity findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public UserEntity findByToken(String token) {
        return userRepository.findByToken(token);
    }

    public List<UserResponseModel> getAllUsers() {
        return findByIsBlocked(false);
    }

    public UserResponseModel getUserInfo(Long id) {
        var user = userRepository.findById(id);
        throwNotFoundException(id, user);
        return convertEntityToResponseModel(userRepository.findById(id).get());
    }

    public List<UserResponseModel> findByIsBlocked(Boolean isBlocked) {
        var listResponse = new ArrayList<UserResponseModel>();
        var users = userRepository.findByIsBlocked(isBlocked);
        if (!CollectionUtils.isEmpty(users)) {
            users.forEach(u -> listResponse.add(convertEntityToResponseModel(u)));
        }
        return listResponse;
    }

    public void updateUserInfo(Long id, UserRequestModel userRequestModel) {
        var user = userRepository.findById(id);
        throwNotFoundException(id, user);
        if (!StringUtils.isEmpty(userRequestModel.getName()))
            user.get().setName(userRequestModel.getName());
        if (!StringUtils.isEmpty(userRequestModel.getPhoneNumber()))
            user.get().setPhoneNumber(userRequestModel.getPhoneNumber());
        if (!StringUtils.isEmpty(userRequestModel.getAvatar()))
            user.get().setAvatar(userRequestModel.getAvatar());
        if (!StringUtils.isEmpty(userRequestModel.getPassword())) {
            user.get().setPassword(passwordEncoder.encode(userRequestModel.getPassword()));
        }
        userRepository.save(user.get());
    }

    public void updateUserRoleByAdmin(Long id, UserRequestModel userRequestModel) {
        var user = userRepository.findById(id);
        throwNotFoundException(id, user);
        if (!CollectionUtils.isEmpty(userRequestModel.getRoles())) {
            // replace cur role
            var roles = new ArrayList<RoleEntity>();
            userRequestModel.getRoles().forEach(r -> roles.add(roleService.getRole(AccountRole.valueOf(r))));
            user.get().setAccountRoles(roles);
        }
        user.get().setIsAuthorized(userRequestModel.getIsAuthorized());

        userRepository.save(user.get());
    }

    public void deleteOrOpenUserByAdmin(Long id) {
        var user = userRepository.findById(id);
        throwNotFoundException(id, user);

        user.get().setIsBlocked(!user.get().getIsBlocked());

        userRepository.save(user.get());
    }

    private void throwNotFoundException(Long id, java.util.Optional<UserEntity> user) {
        if (user.isEmpty()) {
            throw new CustomErrorException(HttpStatus.NOT_FOUND,
                    new ErrorObject("E404001", "User Not Found id = " + id));
        }
    }

    private UserResponseModel convertEntityToResponseModel(UserEntity userEntity) {
        var userResponse = new UserResponseModel();
        userResponse.setId(userEntity.getId());
        userResponse.setEmail(userEntity.getEmail());
        userResponse.setAvatar(userEntity.getAvatar());
        userResponse.setName(userEntity.getName());
        userResponse.setPassword(userEntity.getPassword());
        userResponse.setPhoneNumber(userEntity.getPhoneNumber());
        userResponse.setIsActivated(userEntity.getIsActivated());
        userResponse.setIsAuthorized(userEntity.getIsAuthorized());
        userResponse.setIsBlocked(userEntity.getIsBlocked());

        var roles = userEntity.getAccountRoles();
        var rolesResponse = new ArrayList<String>();
        roles.forEach(role -> rolesResponse.add(role.getRole().name()));
        userResponse.setRoles(rolesResponse);
        return userResponse;
    }

    public ResponseEntity<?> processingImage(MultipartFile[] multipartFile) {
        var uploadRootPath = "D:\\Projects\\datn\\datn\\front-web\\public\\image";

        System.out.println("uploadRootPath=" + uploadRootPath);

        var uploadRootDir = new File(uploadRootPath);
        // Create Folder If not exist
        if (!uploadRootDir.exists()) {
            uploadRootDir.mkdirs();
        }

        MultipartFile[] fileDatas = multipartFile;

        var uploadedFiles = new ArrayList<File>();
        var failedFiles = new ArrayList<String>();
        var fileNames = new ArrayList<String>();
        for (MultipartFile fileData : fileDatas) {

            // format name file
            var date = new Date();
            var dateFormat = new SimpleDateFormat("yyyy-MM-dd HH-mm-ss");
            // File Name in client
            var name = dateFormat.format(date) + fileData.getOriginalFilename();
            System.out.println("Client File Name = " + name);

            if (name.length() > 0) {
                try {
                    // File Name in Server
                    var serverFile = new File(uploadRootDir.getAbsolutePath() + File.separator + name);

                    var stream = new BufferedOutputStream(new FileOutputStream(serverFile));
                    stream.write(fileData.getBytes());
                    stream.close();

                    uploadedFiles.add(serverFile);
                    fileNames.add(name);
                    System.out.println("Write file: " + serverFile);
                } catch (Exception e) {
                    System.out.println("Error Write file: " + name);
                    failedFiles.add(name);
                }
            }
        }
        if (failedFiles.size() > 0) {
            return new ResponseEntity<>(HttpStatus.PAYLOAD_TOO_LARGE);
        }
        return ResponseEntity.ok(fileNames);
    }

    public ResponseEntity<?> getTopUser() {
        var userAsss = userAssignmentRepository.findTopUser();
        var listReturn = new ArrayList<UserAssignmentResponseModel>();
        if (!CollectionUtils.isEmpty(userAsss)) {
            userAsss.forEach(item -> listReturn.add(convertEntityToModel(item)));
        }
        return ResponseEntity.ok(listReturn);
    }

    private UserAssignmentResponseModel convertEntityToModel(UserAssignment e) {
        var obj = new UserAssignmentResponseModel();
        obj.setId(e.getId());
        obj.setCreatedAt(e.getCreatedAt());
        obj.setCreatedBy(e.getCreatedBy());
        obj.setIsCompleted(e.getIsCompleted());
        obj.setIsRejected(e.getIsRejected());
        obj.setRate(e.getRate());
        obj.setReason(e.getReason());
        obj.setRequestId(e.getRequestId());
        obj.setResponseId(e.getResponseId());
        obj.setUpdatedAt(e.getUpdatedAt());
        obj.setUpdatedBy(e.getUpdatedBy());
        var user = userRepository.findById(e.getResponseId());
        if (!user.isEmpty()) {
            var uResponse = new UserResponseModel();
            uResponse.setId(user.get().getId());
            uResponse.setEmail(user.get().getEmail());
            uResponse.setAvatar(user.get().getAvatar());
            uResponse.setName(user.get().getName());
            obj.setResponseInfo(uResponse);
        }
        return obj;
    }
}
