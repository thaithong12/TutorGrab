package com.thaithong.datn.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.Date;
import java.util.List;
import java.util.Set;

@EqualsAndHashCode(callSuper = true, exclude = "users")
@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserEntity extends BaseEntity {
    @Column(unique=true)
    private String email;

    private String password;

    private String name;

    @Column(name = "phone_number")
    private String phoneNumber;

    private String token;

    private String avatar;

    private String jwt;

    /**
     * passport
     */
    private String identification;

    @Column(name = "student_card")
    private String studentCard;

    @Column(name = "college_degree")
    private String collegeDegree;

    @Column(name = "is_activated")
    private Boolean isActivated;

    @Column(name = "is_authorized")
    private Boolean isAuthorized;

    @Column(name = "token_expdate")
    private Date tokenExpDate;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinTable(name = "acc_role_relationship",
            joinColumns = @JoinColumn(name = "acc_id"),
            inverseJoinColumns = @JoinColumn(name = "acc_role_id"))
    private Set<RoleEntity> accountRoles;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinTable(name = "user_group",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "group_id"))
    private Set<GroupEntity> groups;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "user")
    private List<UserAssignment> userAssignments;

}
