package com.thaithong.datn.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "creadit_cards")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class CreditCardEntity extends BaseEntity {
    private String name;

    @Column(name = "card_number")
    private String cardNumber;

    @Column(name = "exp_date")
    @Temporal(TemporalType.DATE)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date expDate;

    private Double balance;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "creditCard")
    private List<PaymentEntity> payments;

    @OneToOne(mappedBy = "creditCardEntity")
    private UserEntity userEntity;
}
