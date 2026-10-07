package com.annotation.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
     * Exact text selected by the user.
     */
    private String selectedText;

    /**
     * PDF page containing the selection.
     * Pages are 1-based.
     */
    private Integer page;

    /**
     * Individual rectangles occupied by
     * the selected text.
     *
     * Multiple rectangles are required when
     * the selection spans multiple lines.
     */
    private List<AnnotationRectangle> rectangles =
            new ArrayList<>();

    /**
     * User's annotation/comment.
     */
    private String comment;

    /**
     * ID of the authenticated annotation author.
     */
    private String authorId;

    /**
     * Highlight color.
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

        this.createdAt =
                LocalDateTime.now();

        this.updatedAt =
                LocalDateTime.now();

        this.rectangles =
                new ArrayList<>();
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

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public List<AnnotationRectangle> getRectangles() {
        return rectangles;
    }

    public void setRectangles(
            List<AnnotationRectangle> rectangles) {

        this.rectangles = rectangles;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
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

    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
            LocalDateTime updatedAt) {

        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {

        return "AnnotationEntity{" +
                "id='" + id + '\'' +
                ", documentId='" + documentId + '\'' +
                ", selectedText='" + selectedText + '\'' +
                ", page=" + page +
                ", rectangles=" + rectangles +
                ", comment='" + comment + '\'' +
                ", authorId='" + authorId + '\'' +
                ", color='" + color + '\'' +
                ", resolved=" + resolved +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}