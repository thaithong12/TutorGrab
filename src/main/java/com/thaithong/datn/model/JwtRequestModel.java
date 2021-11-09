package com.thaithong.datn.model;

import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JwtRequestModel {
    @NotNull
    @Email(regexp = "^[A-Za-z0-9+_.-]+@(.+)$")
    private String email;

    @NotNull
    @Size(max = 255)
    private String name;

    @NotNull
    @Size(max = 50)
    private String password;

    @NotNull
    @Size(max = 20)
    private String phoneNumber;

    private String role;
}
