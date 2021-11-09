package com.thaithong.datn.entity;

import com.thaithong.datn.enums.AccountRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import java.util.HashSet;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "account_roles")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class RoleEntity extends BaseEntity{
    @Enumerated(EnumType.STRING)
    private AccountRole role = AccountRole.ROLE_USER;

    @ManyToMany(mappedBy = "accountRoles", cascade = CascadeType.ALL)
    private Set<UserEntity> accounts = new HashSet<>();
}
