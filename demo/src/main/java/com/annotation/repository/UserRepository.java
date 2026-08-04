package com.annotation.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.annotation.model.UserEntity;

public interface UserRepository extends MongoRepository<UserEntity, String> {

    Optional<UserEntity> findByEmail(String email);

    boolean existsByEmail(String email);
}