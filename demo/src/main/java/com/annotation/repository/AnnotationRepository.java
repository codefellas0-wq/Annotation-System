package com.annotation.repository;
import org.springframework.data.mongodb.repository.Query;
import com.annotation.model.AnnotationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AnnotationRepository
        extends MongoRepository<AnnotationEntity, String> {

    Page<AnnotationEntity> findByDocumentId(
            String documentId,
            Pageable pageable);

            @Query("""
{
  "$or": [
    { "comment": { "$regex": ?0, "$options": "i" } },
    { "selectedText": { "$regex": ?0, "$options": "i" } },
    { "author": { "$regex": ?0, "$options": "i" } }
  ]
}
""")
Page<AnnotationEntity> searchAnnotations(
        String keyword,
        Pageable pageable
);

}
