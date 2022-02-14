package com.thaithong.datn.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserEntity extends BaseEntity {
    @Column(unique = true)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String email;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String password;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String name;

    @Column(name = "phone_number")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String phoneNumber;

    //@Column(name = "wstoken")
    private String token;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String avatar;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Column(columnDefinition = "LONGTEXT")
    private String jwt;

    /**
     * passport
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String identification;

    @Column(name = "student_card")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String studentCard;

    @Column(name = "college_degree")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String collegeDegree;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Column(name = "is_activated")
    private Boolean isActivated;

    @Column(name = "is_authorized")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Boolean isAuthorized;

    @Column(name = "is_blocked")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Boolean isBlocked;

    @Column(name = "token_expdate")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Date tokenExpDate;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(name = "user_role_relationship",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private List<RoleEntity> accountRoles;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "user_group",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "group_id"))
    private List<GroupEntity> groups;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    private List<UserAssignment> userAssignments;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "creditcard_id", referencedColumnName = "id")
    private CreditCardEntity creditCardEntity;
}
