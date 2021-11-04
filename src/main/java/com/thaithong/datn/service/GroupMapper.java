package com.thaithong.datn.service;

import com.thaithong.datn.entity.GroupEntity;
import com.thaithong.datn.entity.MessageEntity;
import com.thaithong.datn.model.GroupResponseModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GroupMapper {

    public GroupResponseModel toGroupResponseModel(GroupEntity grp, Long id) {
        GroupResponseModel grpDTO = new GroupResponseModel();
        grpDTO.setId(grp.getId());
        grpDTO.setName(grp.getName());
        return grpDTO;
    }
}
