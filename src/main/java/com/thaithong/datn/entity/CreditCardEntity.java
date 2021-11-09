package com.thaithong.datn.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
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
}
