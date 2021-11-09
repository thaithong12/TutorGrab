package com.thaithong.datn.service;

import com.thaithong.datn.entity.RoleEntity;
import com.thaithong.datn.entity.UserEntity;
import com.thaithong.datn.enums.AccountRole;
import com.thaithong.datn.model.UserRequestModel;
import com.thaithong.datn.model.UserResponseModel;
import com.thaithong.datn.repository.UserRepository;
import com.thaithong.datn.utils.CustomErrorException;
import com.thaithong.datn.utils.ErrorObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleService roleService;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
}
