package com.annotation.controller;
import com.annotation.dto.DocumentRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.annotation.model.DocumentEntity;
import com.annotation.service.DocumentService;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/documents")
@Tag(
    name = "Document API",
    description = "APIs for uploading and managing documents"
)


public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping
    public ResponseEntity<DocumentEntity> saveDocument(
            @RequestBody DocumentRequest request) {

        DocumentEntity savedDocument =
                documentService.saveDocument(request);

        return ResponseEntity.ok(savedDocument);
    }

   @PostMapping("/upload")
public ResponseEntity<DocumentEntity> uploadDocument(
        @RequestParam("file") MultipartFile file) {

    DocumentEntity savedDocument = documentService.uploadDocument(file);

    return ResponseEntity.ok(savedDocument);
}
}