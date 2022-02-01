package com.thaithong.datn.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "files")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FileEntity extends BaseEntity {
    @Column(name = "message_id")
    private Long messageId;

    @Column(name = "file_name")
    private String fileName;

    private String url;

    @Column(name = "group_id")
    private Long groupId;

    @Column(name = "userId")
    private Long userId;
}
