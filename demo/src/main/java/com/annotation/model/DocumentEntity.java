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

    private Long fileSize;

    /**
     * Reference to the original file stored in MongoDB GridFS.
     */
    private String gridFsFileId;

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

    public Long getFileSize() {
        return fileSize;
    }

    public String getGridFsFileId() {
        return gridFsFileId;
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

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public void setGridFsFileId(String gridFsFileId) {
        this.gridFsFileId = gridFsFileId;
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
                ", fileSize=" + fileSize +
                ", gridFsFileId='" + gridFsFileId + '\'' +
                ", uploadedAt=" + uploadedAt +
                '}';
    }
}