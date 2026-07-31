package com.annotation.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.util.List;
import com.annotation.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.annotation.dto.AnnotationDTO;
import com.annotation.dto.UpdateAnnotationDTO;
import com.annotation.model.AnnotationEntity;
import com.annotation.repository.AnnotationRepository;

@Service
public class AnnotationService {
    private static final Logger logger =
        LoggerFactory.getLogger(AnnotationService.class);

    private final AnnotationRepository annotationRepository;

    public AnnotationService(AnnotationRepository annotationRepository) {
        this.annotationRepository = annotationRepository;
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

    AnnotationEntity savedAnnotation =
            annotationRepository.save(annotation);

    logger.info("Annotation created successfully with id: {}",
            savedAnnotation.getId());

    return savedAnnotation;
}
    /**
     * Fetch all annotations for a document.
     */
    public List<AnnotationEntity> getAnnotationsByDocumentId(String documentId) {
        return annotationRepository.findByDocumentId(documentId);
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
public AnnotationEntity updateAnnotation(String annotationId,
                                         UpdateAnnotationDTO updateDTO) {

    logger.info("Updating annotation with id: {}", annotationId);

    AnnotationEntity annotation = annotationRepository
            .findById(annotationId)
            .orElseThrow(() -> {
                logger.warn("Annotation not found with id: {}", annotationId);
                return new ResourceNotFoundException(
                        "Annotation not found with id: " + annotationId);
            });

    // Update only allowed fields
    annotation.setComment(updateDTO.getComment());
    annotation.setColor(updateDTO.getColor());
    annotation.setResolved(updateDTO.getResolved());

    // Update timestamp
    annotation.setUpdatedAt(LocalDateTime.now());

    // Save updated annotation
    AnnotationEntity updatedAnnotation = annotationRepository.save(annotation);

    logger.info("Annotation updated successfully with id: {}", annotationId);

    return updatedAnnotation;
}
}