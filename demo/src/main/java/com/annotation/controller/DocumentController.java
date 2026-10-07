package com.annotation.controller;

import java.util.List;

import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.annotation.model.DocumentEntity;
import com.annotation.service.DocumentService;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.Resource;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.MediaType;
@RestController
@RequestMapping("/api/documents")
@Tag(
        name = "Document API",
        description = "APIs for uploading and managing documents"
)
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(
            DocumentService documentService) {

        this.documentService = documentService;
    }

    /**
     * Upload original document.
     */
    @PostMapping(
        value = "/upload",
        consumes = "multipart/form-data"
)
public ResponseEntity<DocumentEntity> uploadDocument(
        @RequestParam("file") MultipartFile file) {

    DocumentEntity savedDocument =
            documentService.uploadDocument(file);

    return ResponseEntity.ok(savedDocument);
}
    /**
     * Get all document metadata.
     */
    @GetMapping
    public ResponseEntity<List<DocumentEntity>> getAllDocuments() {

        List<DocumentEntity> documents =
                documentService.getAllDocuments();

        return ResponseEntity.ok(documents);
    }

    /**
     * Get document metadata by ID.
     */
    @GetMapping("/{documentId}")
    public ResponseEntity<DocumentEntity> getDocumentById(
            @PathVariable String documentId) {

        DocumentEntity document =
                documentService.getDocumentById(documentId);

        return ResponseEntity.ok(document);
    }

    @GetMapping("/{documentId}/file")
public ResponseEntity<Resource> getOriginalFile(
        @PathVariable String documentId) {

    GridFsResource resource =
            documentService.getOriginalFile(documentId);

    return ResponseEntity.ok()
            .contentType(
                    MediaType.parseMediaType(
                            resource
                                    .getContentType()
                    )
            )
            .header(
                    "Content-Disposition",
                    "inline; filename=\"" +
                            resource.getFilename() +
                            "\""
            )
            .body(resource);
}
}