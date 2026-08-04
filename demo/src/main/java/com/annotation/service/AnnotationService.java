package com.annotation.service;
import org.springframework.data.mongodb.core.MongoTemplate;
import java.time.LocalDateTime;

import java.util.List;
import org.slf4j.Logger;
import org.springframework.data.domain.PageImpl;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import com.annotation.util.PageableUtil;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import com.annotation.dto.AnnotationDTO;
import com.annotation.dto.UpdateAnnotationDTO;
import com.annotation.exception.ResourceNotFoundException;
import com.annotation.model.AnnotationEntity;
import com.annotation.repository.AnnotationRepository;


@Service
public class AnnotationService {

    private static final Logger logger =
            LoggerFactory.getLogger(AnnotationService.class);

    private final AnnotationRepository annotationRepository;
    private final MongoTemplate mongoTemplate;

    public AnnotationService(
        AnnotationRepository annotationRepository,
        MongoTemplate mongoTemplate) {

    this.annotationRepository = annotationRepository;
    this.mongoTemplate = mongoTemplate;
}
    /**
     * Create a new annotation.
     */
    public AnnotationEntity createAnnotation(AnnotationDTO dto) {

        logger.info("Creating annotation for documentId: {}",
                dto.getDocumentId());

        AnnotationEntity annotation = new AnnotationEntity();

        annotation.setDocumentId(dto.getDocumentId());
        annotation.setSelectedText(dto.getSelectedText());
        annotation.setComment(dto.getComment());
        annotation.setAuthor(dto.getAuthor());
        annotation.setStartOffset(dto.getStartOffset());
        annotation.setEndOffset(dto.getEndOffset());
        annotation.setColor(dto.getColor());
        annotation.setResolved(false);
        annotation.setCreatedAt(LocalDateTime.now());
        annotation.setUpdatedAt(LocalDateTime.now());

        AnnotationEntity savedAnnotation =
                annotationRepository.save(annotation);

        logger.info("Annotation created successfully with id: {}",
                savedAnnotation.getId());

        return savedAnnotation;
    }

    /**
     * Fetch annotations for a document with pagination.
     */
   public Page<AnnotationEntity> getAnnotationsByDocumentId(
        String documentId,
        int page,
        int size,
        String sortBy,
        String direction) {

    logger.info(
            "Fetching annotations | documentId={} | page={} | size={} | sortBy={} | direction={}",
            documentId,
            page,
            size,
            sortBy,
            direction);

    

   
    Pageable pageable =
        PageableUtil.buildPageable(
                page,
                size,
                sortBy,
                direction
        );
    
    Page<AnnotationEntity> annotations =
            annotationRepository.findByDocumentId(
                    documentId,
                    pageable);

    logger.info(
            "Retrieved {} annotation(s)",
            annotations.getNumberOfElements());

    return annotations;
}

    /**
     * Delete annotation by ID.
     */
    public void deleteAnnotation(String annotationId) {

        logger.info("Deleting annotation with id: {}",
                annotationId);

        if (!annotationRepository.existsById(annotationId)) {

            logger.warn("Annotation not found with id: {}",
                    annotationId);

            throw new ResourceNotFoundException(
                    "Annotation not found with id: " + annotationId);
        }

        annotationRepository.deleteById(annotationId);

        logger.info("Annotation deleted successfully: {}",
                annotationId);
    }

    /**
     * Update annotation.
     */
    public AnnotationEntity updateAnnotation(
            String annotationId,
            UpdateAnnotationDTO updateDTO) {

        logger.info("Updating annotation with id: {}",
                annotationId);

        AnnotationEntity annotation = annotationRepository
                .findById(annotationId)
                .orElseThrow(() -> {

                    logger.warn("Annotation not found with id: {}",
                            annotationId);

                    return new ResourceNotFoundException(
                            "Annotation not found with id: "
                                    + annotationId);
                });

        // Update allowed fields
        annotation.setComment(updateDTO.getComment());
        annotation.setColor(updateDTO.getColor());
        annotation.setResolved(updateDTO.getResolved());

        // Update timestamp
        annotation.setUpdatedAt(LocalDateTime.now());

        AnnotationEntity updatedAnnotation =
                annotationRepository.save(annotation);

        logger.info("Annotation updated successfully with id: {}",
                annotationId);

        return updatedAnnotation;
    }

/*     Searching method */
    public Page<AnnotationEntity> searchAnnotations(
        String keyword,
        int page,
        int size,
        String sortBy,
        String direction) {

    logger.info(
            "Searching annotations | keyword={} | page={} | size={} | sortBy={} | direction={}",
            keyword,
            page,
            size,
            sortBy,
            direction);

    // Allowed sorting fields
    Pageable pageable =
        PageableUtil.buildPageable(
                page,
                size,
                sortBy,
                direction
        );
    
   
    Page<AnnotationEntity> annotations =
            annotationRepository.searchAnnotations(
                    keyword,
                    pageable);

    logger.info(
            "Search returned {} annotation(s)",
            annotations.getNumberOfElements());

    return annotations;
}
 /* FILTERING SERVICE */
public Page<AnnotationEntity> filterAnnotations(
        String author,
        Boolean resolved,
        int page,
        int size,
        String sortBy,
        String direction) {

    logger.info(
            "Filtering annotations | author={} | resolved={}",
            author,
            resolved);

    Query query = new Query();

    if (author != null && !author.isBlank()) {
        query.addCriteria(
                Criteria.where("author").is(author));
    }

    if (resolved != null) {
        query.addCriteria(
                Criteria.where("resolved").is(resolved));
    }
Pageable pageable =
        PageableUtil.buildPageable(
                page,
                size,
                sortBy,
                direction
        );
    

   Query countQuery = Query.of(query);

query.with(pageable);

long total = mongoTemplate.count(
        countQuery,
        AnnotationEntity.class
);

List<AnnotationEntity> annotations =
        mongoTemplate.find(query, AnnotationEntity.class);

return new PageImpl<>(
        annotations,
        pageable,
        total
);
}
}