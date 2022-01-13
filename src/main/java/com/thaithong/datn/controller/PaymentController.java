package com.thaithong.datn.controller;

import com.thaithong.datn.service.PaymentService;
import com.thaithong.datn.utils.CustomErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api")
@CrossOrigin
public class PaymentController {
    @Autowired
    PaymentService paymentService;

    @GetMapping("payments/history/{userId}")
    public ResponseEntity<?> getPaymentHistory (@PathVariable Long userId) {
        return null;
    }

    @PostMapping("/payments/cancel")
    public ResponseEntity<?> cancelPayment () {
        return null;
    }
}
