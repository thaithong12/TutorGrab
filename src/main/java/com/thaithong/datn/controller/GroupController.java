package com.thaithong.datn.controller;

import com.thaithong.datn.service.GroupService;
import com.thaithong.datn.utils.CustomErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api")
@CrossOrigin
public class GroupController {
    @Autowired
    private GroupService groupService;

    /**
     * 　ユーザーIDとしてループの一覧情報を取得する
     *
     * @param id ユーザーID
     * @return グループの一覧情報
     */
    @GetMapping("/groups/user/{id}")
    public ResponseEntity<?> getAllGroups(@PathVariable Long id) {
        return ResponseEntity.ok(groupService.getAllGroups(id));
    }

    /**
     * 　グループ詳細情報を取得
     *
     * @param id グループID
     * @return グループ詳細情報
     */
    @GetMapping("/groups/{id}")
    public ResponseEntity<?> getGroup(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(groupService.getGroup(id));
        } catch (CustomErrorException customErrorException) {
            return ResponseEntity.status(customErrorException.getStatus()).body(customErrorException.getData());
        }
    }
}
