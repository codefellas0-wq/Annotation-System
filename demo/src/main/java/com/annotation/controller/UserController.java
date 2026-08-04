package com.annotation.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.annotation.dto.RegisterDTO;
import com.annotation.dto.UserResponseDTO;
import com.annotation.response.ApiResponse;
import com.annotation.service.UserService;
import com.annotation.dto.LoginDTO;
import com.annotation.dto.AuthenticationResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(
            summary = "Register User",
            description = "Registers a new user."
    )
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDTO>> registerUser(

            @Valid
            @RequestBody
            RegisterDTO registerDTO) {

        UserResponseDTO user =
                userService.registerUser(registerDTO);

        ApiResponse<UserResponseDTO> response =
                new ApiResponse<>(
                        true,
                        "User registered successfully.",
                        user
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    @Operation(
        summary = "Login User",
        description = "Authenticates a user."
)
@PostMapping("/login")
public ResponseEntity<ApiResponse<AuthenticationResponseDTO>> loginUser(

        @Valid
        @RequestBody
        LoginDTO loginDTO) {

    AuthenticationResponseDTO responseDTO =
            userService.loginUser(loginDTO);

    ApiResponse<AuthenticationResponseDTO> response =
            new ApiResponse<>(
                    true,
                    "Login successful.",
                    responseDTO
            );

    return ResponseEntity.ok(response);
}
}