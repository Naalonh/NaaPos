package com.naalonh.pos.controller;

import com.naalonh.pos.dto.RegisterOwnerRequest;
import com.naalonh.pos.service.RegistrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/register")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    public ResponseEntity<?> registerOwner(@RequestBody RegisterOwnerRequest request) {

        registrationService.registerOwner(request);

        return ResponseEntity.ok("Registration successful. Waiting approval.");
    }
}