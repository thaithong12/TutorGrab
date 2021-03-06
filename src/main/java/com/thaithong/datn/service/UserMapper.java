package com.thaithong.datn.service;

import com.thaithong.datn.entity.UserEntity;
import com.thaithong.datn.enums.AccountRole;
import com.thaithong.datn.model.GroupResponseModel;
import com.thaithong.datn.model.UserResponseModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserMapper {
    private Logger log = LoggerFactory.getLogger(UserMapper.class);

    @Autowired
    private GroupMapper groupMapper;

    @Autowired
    private RoleService roleService;

    public UserResponseModel toUserResponseModel(UserEntity userEntity) {
        // Init
        var userDTO = new UserResponseModel();
        var groupEntitySet = new ArrayList<GroupResponseModel>();

//        var roles = roleService.getRoles();

        // Main user infos
        userDTO.setId(userEntity.getId());
        userDTO.setName(userEntity.getName());
        userDTO.setEmail(userEntity.getEmail());
        userDTO.setBalance(userEntity.getCreditCardEntity().getBalance());

        // userDTO.setWsToken(userEntity.getWsToken());
        // Global role
        userDTO.setRoles(userEntity.getAccountRoles().stream().map(item -> item.getRole().toString()).collect(Collectors.toList()));
        // Spring security mapping
        userDTO.setIsActivated(userEntity.getIsActivated());
        userDTO.setJwt(userEntity.getJwt());
        userEntity.getGroups().forEach(groupEntity ->
                groupEntitySet.add(groupMapper.toGroupResponseModel(groupEntity, userEntity.getId())));
        userDTO.setGroupList(groupEntitySet);
        return userDTO;
    }
}
