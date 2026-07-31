package com.annotation.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.annotation.model.AnnotationEntity;

@Repository
public interface AnnotationRepository extends MongoRepository<AnnotationEntity, String> {

    /**
     * Fetch all annotations belonging to a specific document.
     *
     * @param documentId The ID of the document.
     * @return List of annotations associated with the document.
     */
    List<AnnotationEntity> findByDocumentId(String documentId);
}