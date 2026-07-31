package com.annotation.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AnnotationDTO {

    @NotBlank(message = "Document ID is required.")
    private String documentId;

    @NotBlank(message = "Selected text cannot be empty.")
    @Size(max = 5000, message = "Selected text cannot exceed 5000 characters.")
    private String selectedText;

    @NotBlank(message = "Comment cannot be empty.")
    @Size(max = 1000, message = "Comment cannot exceed 1000 characters.")
    private String comment;

    @NotBlank(message = "Author name is required.")
    @Size(max = 100, message = "Author name cannot exceed 100 characters.")
    private String author;

    @NotNull(message = "Start offset is required.")
    @Min(value = 0, message = "Start offset cannot be negative.")
    private Integer startOffset;

    @NotNull(message = "End offset is required.")
    @Min(value = 0, message = "End offset cannot be negative.")
    private Integer endOffset;

    @NotBlank(message = "Highlight color is required.")
    @Size(max = 30, message = "Color name is too long.")
    private String color;

    public AnnotationDTO() {
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

    @Override
    public String toString() {
        return "AnnotationDTO{" +
                "documentId='" + documentId + '\'' +
                ", author='" + author + '\'' +
                ", selectedText='" + selectedText + '\'' +
                '}';
    }
}