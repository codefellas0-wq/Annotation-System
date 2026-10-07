package com.annotation.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.annotation.exception.ResourceNotFoundException;
import com.annotation.model.UserEntity;
import com.annotation.repository.UserRepository;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;

    public AuthenticationService(
            UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    /**
     * Returns the currently authenticated user.
     */
   
    public UserEntity getCurrentUser() {

    Authentication authentication =
            SecurityContextHolder
                    .getContext()
                    .getAuthentication();

    System.out.println("Authentication Name: " + authentication.getName());

    String email = authentication.getName();

    UserEntity user = userRepository
            .findByEmail(email)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Authenticated user not found."));

    System.out.println("Current User ID: " + user.getId());

    return user;
}
}