package com.thaithong.datn.service;

import com.thaithong.datn.entity.GroupEntity;
import com.thaithong.datn.model.GroupResponseModel;
import com.thaithong.datn.model.MessageResponseModel;
import com.thaithong.datn.model.UserResponseModel;
import com.thaithong.datn.repository.GroupRepository;
import com.thaithong.datn.utils.CustomErrorException;
import com.thaithong.datn.utils.ErrorObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupService {
    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private AssignmentService assignmentService;

    public List<GroupResponseModel> getAllGroups(Long userId) {
        var groups = groupRepository.findByUserId(userId);
        var groupsResponseList = new ArrayList<GroupResponseModel>();
        if (!CollectionUtils.isEmpty(groups)) {
            groups.forEach(g -> groupsResponseList.add(convertEntityToResponseModel(g)));
        }
        return groupsResponseList;
    }

    public GroupResponseModel getGroup (Long idGroup) {
        var group = groupRepository.findById(idGroup);
        if (group.isEmpty()) {
            throw new CustomErrorException(HttpStatus.NOT_FOUND, new ErrorObject("E404001", "Group Not found with id = "+ idGroup));
        }
        return convertEntityToResponseModel(group.get());
    }

    private GroupResponseModel convertEntityToResponseModel(GroupEntity groupEntity) {
        var groupResponseModel = new GroupResponseModel();
        groupResponseModel.setId(groupEntity.getId());
        groupResponseModel.setName(groupEntity.getName());
        //groupResponseModel.setUserId(groupEntity.getCreatedBy());
        groupResponseModel.setIsClosed(groupEntity.getIsClosed());

        groupResponseModel.setAssignment(assignmentService.getAssignment(groupEntity.getAssignmentId()));

        var users = groupEntity.getUsers().stream().map(
                u -> {
                    var user = new UserResponseModel();
                    user.setId(u.getId());
                    user.setEmail(u.getEmail());
                    user.setName(u.getName());
                    user.setAvatar(u.getAvatar());
                    return user;
                }
        ).collect(Collectors.toList());
        groupResponseModel.setUsers(users);

        var msgs = groupEntity.getMessages().stream().map(
                u -> {
                    var msg = new MessageResponseModel();
                    msg.setId(u.getId());
                    msg.setReceiverId(u.getReceiverId());
                    msg.setSenderId(u.getSenderId());
                    msg.setCreatedAt(u.getCreatedAt());
                    msg.setUpdatedAt(u.getUpdatedAt());
                    msg.setType(u.getType());
                    msg.setText(u.getText());
                    msg.setFile(u.getFile());
                    return msg;
                }
        ).collect(Collectors.toList());
        groupResponseModel.setMessages(msgs);

        return groupResponseModel;
    }
}
