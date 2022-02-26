package com.thaithong.datn.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "group_tbls")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GroupEntity extends BaseEntity {
    private String name;

    private String url;

    /**
     * administratorId
     */
    private Long userId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assginment_id")
    private AssignmentEntity assignmentEntity;

    @ManyToMany(mappedBy = "groups", cascade = CascadeType.ALL)
    private List<UserEntity> users;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
    private List<MessageEntity> messages;

    @Column(name = "is_closed")
    private Boolean isClosed;
}
