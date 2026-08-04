package com.annotation.controller;


import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.annotation.dto.AnnotationDTO;
import com.annotation.dto.UpdateAnnotationDTO;
import com.annotation.model.AnnotationEntity;
import com.annotation.response.ApiResponse;
import com.annotation.service.AnnotationService;

import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/annotations")
@Tag(
    name = "Annotation API",
    description = "APIs for creating and managing document annotations"
)
public class AnnotationController {

    private final AnnotationService annotationService;

    public AnnotationController(AnnotationService annotationService) {
        this.annotationService = annotationService;
    }

    /**
     * Create a new annotation.
     */
    @Operation(
    summary = "Create Annotation",
    description = "Creates a new annotation for a document."
)
    @PostMapping
    public ResponseEntity<ApiResponse<AnnotationEntity>> createAnnotation(
            @Valid @RequestBody AnnotationDTO annotationDTO) {

        AnnotationEntity annotation =
                annotationService.createAnnotation(annotationDTO);

        ApiResponse<AnnotationEntity> response =
                new ApiResponse<>(
                        true,
                        "Annotation created successfully.",
                        annotation);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    /**
     * Get all annotations for a document.
     */
   @Operation(
        summary = "Get Annotations",
        description = "Returns paginated and sorted annotations for a document."
)
@ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Annotations retrieved successfully"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "400",
                description = "Invalid request parameters"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "404",
                description = "Document not found"
        )
})
@GetMapping("/document/{documentId}")
public ResponseEntity<ApiResponse<Page<AnnotationEntity>>> getAnnotationsByDocumentId(

        @PathVariable String documentId,

        @RequestParam(defaultValue = "0")
        int page,

        @RequestParam(defaultValue = "10")
        int size,

        @RequestParam(defaultValue = "createdAt")
        String sortBy,

        @RequestParam(defaultValue = "desc")
        String direction) {

    Page<AnnotationEntity> annotations =
            annotationService.getAnnotationsByDocumentId(
                    documentId,
                    page,
                    size,
                    sortBy,
                    direction);

    ApiResponse<Page<AnnotationEntity>> response =
            new ApiResponse<>(
                    true,
                    "Annotations retrieved successfully.",
                    annotations
            );

    return ResponseEntity.ok(response);
}
    /**
     * Delete annotation.
     */@Operation(
    summary = "Delete Annotation",
    description = "Deletes an annotation using its ID."
)

    @DeleteMapping("/{annotationId}")
    public ResponseEntity<ApiResponse<Void>> deleteAnnotation(
            @PathVariable String annotationId) {

        annotationService.deleteAnnotation(annotationId);

        ApiResponse<Void> response =
                new ApiResponse<>(
                        true,
                        "Annotation deleted successfully.",
                        null);

        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Update Annotation",
        description = "Updates the comment, color and resolved status of an existing annotation."
)

@PutMapping("/{annotationId}")
public ResponseEntity<ApiResponse<AnnotationEntity>> updateAnnotation(
        @PathVariable String annotationId,
        @Valid @RequestBody UpdateAnnotationDTO updateDTO) {

    AnnotationEntity updatedAnnotation =
            annotationService.updateAnnotation(annotationId, updateDTO);

    ApiResponse<AnnotationEntity> response =
            new ApiResponse<>(
                    true,
                    "Annotation updated successfully.",
                    updatedAnnotation
            );

    return ResponseEntity.ok(response);
}

@Operation(
        summary = "Search Annotations",
        description = "Search annotations by keyword in comment, selected text, or author."
)
@ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Search completed successfully"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "400",
                description = "Invalid request parameters"
        )
})
@GetMapping("/search")
public ResponseEntity<ApiResponse<Page<AnnotationEntity>>> searchAnnotations(

        @RequestParam String keyword,

        @RequestParam(defaultValue = "0")
        int page,

        @RequestParam(defaultValue = "10")
        int size,

        @RequestParam(defaultValue = "createdAt")
        String sortBy,

        @RequestParam(defaultValue = "desc")
        String direction) {

    Page<AnnotationEntity> annotations =
            annotationService.searchAnnotations(
                    keyword,
                    page,
                    size,
                    sortBy,
                    direction);

    ApiResponse<Page<AnnotationEntity>> response =
            new ApiResponse<>(
                    true,
                    "Search completed successfully.",
                    annotations
            );

    return ResponseEntity.ok(response);
}

/* FILTERING */
@Operation(
        summary = "Filter Annotations",
        description = "Filters annotations dynamically using optional parameters."
)
@GetMapping("/filter")
public ResponseEntity<ApiResponse<Page<AnnotationEntity>>> filterAnnotations(

        @RequestParam(required = false)
        String author,

        @RequestParam(required = false)
        Boolean resolved,

        @RequestParam(defaultValue = "0")
        int page,

        @RequestParam(defaultValue = "10")
        int size,

        @RequestParam(defaultValue = "createdAt")
        String sortBy,

        @RequestParam(defaultValue = "desc")
        String direction) {

    Page<AnnotationEntity> annotations =
            annotationService.filterAnnotations(
                    author,
                    resolved,
                    page,
                    size,
                    sortBy,
                    direction);

    ApiResponse<Page<AnnotationEntity>> response =
            new ApiResponse<>(
                    true,
                    "Annotations filtered successfully.",
                    annotations
            );

    return ResponseEntity.ok(response);
}
}