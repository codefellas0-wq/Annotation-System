package com.annotation.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "documents")
public class DocumentEntity {

    @Id
    private String id;

    private String fileName;

    private String contentType;

    private String extractedText;

    private Long totalCharacters;

    private LocalDateTime uploadedAt;

    // Default Constructor
    public DocumentEntity() {
    }

    // Getters

    public String getId() {
        return id;
    }

    public String getFileName() {
        return fileName;
    }

    public String getContentType() {
        return contentType;
    }

    public String getExtractedText() {
        return extractedText;
    }

    public Long getTotalCharacters() {
        return totalCharacters;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    // Setters

    public void setId(String id) {
        this.id = id;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public void setExtractedText(String extractedText) {
        this.extractedText = extractedText;
    }

    public void setTotalCharacters(Long totalCharacters) {
        this.totalCharacters = totalCharacters;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    @Override
    public String toString() {
        return "DocumentEntity{" +
                "id='" + id + '\'' +
                ", fileName='" + fileName + '\'' +
                ", contentType='" + contentType + '\'' +
                ", totalCharacters=" + totalCharacters +
                ", uploadedAt=" + uploadedAt +
                '}';
    }
}