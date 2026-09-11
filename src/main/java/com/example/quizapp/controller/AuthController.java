package com.example.quizapp.controller;

import com.example.quizapp.dto.LoginRequest;
import com.example.quizapp.dto.RegisterRequest;
import com.example.quizapp.dto.UserResponse;
import com.example.quizapp.model.User;
import com.example.quizapp.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest request) {

        User user = authService.register(
                request.getName(),
                request.getEmail(),
                request.getPassword()
        );

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
    @PostMapping("/login")
public UserResponse login(@RequestBody LoginRequest request) {

    User user = authService.login(
            request.getEmail(),
            request.getPassword()
    );

    return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail()
    );
}
}


