package com.annotation.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.annotation.exception.ResourceNotFoundException;
import com.annotation.exception.UnsupportedFileTypeException;
import com.annotation.model.DocumentEntity;
import com.annotation.repository.DocumentRepository;


import org.bson.types.ObjectId;

import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import com.mongodb.client.gridfs.model.GridFSFile;
@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final GridFsTemplate gridFsTemplate;

    public DocumentService(
            DocumentRepository documentRepository,
            GridFsTemplate gridFsTemplate) {

        this.documentRepository = documentRepository;
        this.gridFsTemplate = gridFsTemplate;
    }

    /**
     * Upload and store the original document in MongoDB GridFS.
     */
    public DocumentEntity uploadDocument(MultipartFile file) {

        // Validate empty file
        if (file.isEmpty()) {
            throw new IllegalArgumentException(
                    "File cannot be empty."
            );
        }

        // Validate file name
        String originalFileName =
                file.getOriginalFilename();

        if (originalFileName == null ||
                originalFileName.isBlank()) {

            throw new IllegalArgumentException(
                    "Invalid file name."
            );
        }

        // Validate file size
        if (file.getSize() > 10 * 1024 * 1024) {

            throw new IllegalArgumentException(
                    "Maximum file size is 10 MB."
            );
        }

        // Validate extension
        String fileName =
                originalFileName.toLowerCase();

        if (!(fileName.endsWith(".txt")
                || fileName.endsWith(".pdf")
                || fileName.endsWith(".docx"))) {

            throw new UnsupportedFileTypeException(
                    "Only TXT, PDF and DOCX files are allowed."
            );
        }

        try {

            /*
             * Store ORIGINAL file in MongoDB GridFS.
             */
            ObjectId gridFsFileId =
                    gridFsTemplate.store(
                            file.getInputStream(),
                            originalFileName,
                            file.getContentType()
                    );

            /*
             * Store metadata/reference in documents collection.
             */
            DocumentEntity document =
                    new DocumentEntity();

            document.setFileName(originalFileName);

            document.setContentType(
                    file.getContentType()
            );

            document.setFileSize(
                    file.getSize()
            );

            document.setGridFsFileId(
                    gridFsFileId.toHexString()
            );

            document.setUploadedAt(
                    LocalDateTime.now()
            );

            DocumentEntity savedDocument =
                    documentRepository.save(document);

            return savedDocument;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to store uploaded file.",
                    e
            );
        }
    }

    /**
     * Retrieve all document metadata.
     */
    public List<DocumentEntity> getAllDocuments() {

        return documentRepository.findAll();
    }

    /**
     * Retrieve document metadata by document ID.
     */
    public DocumentEntity getDocumentById(
            String documentId) {

        return documentRepository
                .findById(documentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Document not found with id: "
                                        + documentId
                        )
                );
    }

    public GridFsResource getOriginalFile(String documentId) {

    DocumentEntity document =
            getDocumentById(documentId);

    ObjectId gridFsFileId =
            new ObjectId(document.getGridFsFileId());

    GridFSFile file =
            gridFsTemplate.findOne(
                    Query.query(
                            Criteria.where("_id")
                                    .is(gridFsFileId)
                    )
            );

    if (file == null) {
        throw new ResourceNotFoundException(
                "Original file not found for document: "
                        + documentId
        );
    }

    return gridFsTemplate.getResource(file);
}
}