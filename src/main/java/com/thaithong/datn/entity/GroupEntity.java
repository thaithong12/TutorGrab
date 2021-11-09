package com.thaithong.datn.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "group_tbls")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GroupEntity extends BaseEntity {
    @Column(name = "assginment_id")
    private Long assignmentId;

    private String name;

    /**
     * administratorId
     */
    private Long userId;

    @ManyToMany(mappedBy = "groups", cascade = CascadeType.ALL)
    private List<UserEntity> users;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
    private List<MessageEntity> messages;
}
