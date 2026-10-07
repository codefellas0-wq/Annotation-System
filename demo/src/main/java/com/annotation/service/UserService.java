package com.annotation.service;

import java.time.LocalDateTime;
import com.annotation.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.annotation.dto.AuthenticationResponseDTO;
import com.annotation.dto.LoginDTO;
import com.annotation.exception.InvalidCredentialsException;
import com.annotation.dto.RegisterDTO;
import com.annotation.dto.UserResponseDTO;
import com.annotation.exception.EmailAlreadyExistsException;
import com.annotation.model.UserEntity;
import com.annotation.repository.UserRepository;

@Service
public class UserService {

    private static final Logger logger =
            LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

   public UserService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
}
    /**
     * Register a new user.
     */
    public UserResponseDTO registerUser(RegisterDTO dto) {

        logger.info("Registering user with email: {}", dto.getEmail());

        if (userRepository.existsByEmail(dto.getEmail())) {

            logger.warn("Registration failed. Email already exists: {}",
                    dto.getEmail());

            throw new EmailAlreadyExistsException(
        "Email is already registered."
);       
 }

        UserEntity user = new UserEntity();

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());

        // Encrypt password before saving
        user.setPassword(
                passwordEncoder.encode(dto.getPassword())
        );

        user.setEnabled(true);

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        UserEntity savedUser = userRepository.save(user);

        logger.info("User registered successfully with id: {}",
                savedUser.getId());

        UserResponseDTO response = new UserResponseDTO();

response.setId(savedUser.getId());
response.setFullName(savedUser.getFullName());
response.setEmail(savedUser.getEmail());
response.setEnabled(savedUser.getEnabled());
response.setCreatedAt(savedUser.getCreatedAt());

return response;
    }
    /**
 * Authenticate user.
 */
public AuthenticationResponseDTO loginUser(LoginDTO dto) {

    logger.info("Login attempt for email: {}", dto.getEmail());

    UserEntity user = userRepository.findByEmail(dto.getEmail())
            .orElseThrow(() -> {

                logger.warn("User not found: {}", dto.getEmail());

                return new InvalidCredentialsException(
                        "Invalid email or password.");
            });

    boolean passwordMatches = passwordEncoder.matches(
            dto.getPassword(),
            user.getPassword());

    if (!passwordMatches) {

        logger.warn("Invalid password for email: {}",
                dto.getEmail());

        throw new InvalidCredentialsException(
                "Invalid email or password.");
    }

    logger.info("User logged in successfully: {}",
            dto.getEmail());

    // Temporary token
   String token = jwtService.generateToken(
        user.getEmail()
);

return new AuthenticationResponseDTO(
        token,
        "Bearer"
);
}
}