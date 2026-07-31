package com.annotation.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "annotations")
public class AnnotationEntity {

    @Id
    private String id;

    /**
     * ID of the document to which this annotation belongs.
     */
    private String documentId;

    /**
     * The exact text selected by the user.
     */
    private String selectedText;

    /**
     * User's annotation/comment.
     */
    private String comment;

    /**
     * Name or identifier of the annotation author.
     */
    private String author;

    /**
     * Starting character position of the selected text.
     */
    private Integer startOffset;

    /**
     * Ending character position of the selected text.
     */
    private Integer endOffset;

    /**
     * Highlight color (Example: yellow, #FFFF00).
     */
    private String color;

    /**
     * Indicates whether the annotation has been resolved.
     */
    private Boolean resolved;

    /**
     * Creation timestamp.
     */
    private LocalDateTime createdAt;

    /**
     * Last modification timestamp.
     */
    private LocalDateTime updatedAt;

    public AnnotationEntity() {
        this.resolved = false;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDocumentId() {
        return documentId;
    }

    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    public String getSelectedText() {
        return selectedText;
    }

    public void setSelectedText(String selectedText) {
        this.selectedText = selectedText;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Integer getStartOffset() {
        return startOffset;
    }

    public void setStartOffset(Integer startOffset) {
        this.startOffset = startOffset;
    }

    public Integer getEndOffset() {
        return endOffset;
    }

    public void setEndOffset(Integer endOffset) {
        this.endOffset = endOffset;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Boolean getResolved() {
        return resolved;
    }

    public void setResolved(Boolean resolved) {
        this.resolved = resolved;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "AnnotationEntity{" +
                "id='" + id + '\'' +
                ", documentId='" + documentId + '\'' +
                ", author='" + author + '\'' +
                ", resolved=" + resolved +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}