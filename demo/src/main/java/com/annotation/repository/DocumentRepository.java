package com.annotation.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.annotation.model.DocumentEntity;

public interface DocumentRepository
        extends MongoRepository<DocumentEntity, String> {

}