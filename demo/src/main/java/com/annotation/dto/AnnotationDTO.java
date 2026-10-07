package com.annotation.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AnnotationDTO {

    @NotBlank(message = "Document ID is required.")
    private String documentId;

    @NotBlank(message = "Selected text cannot be empty.")
    @Size(
            max = 5000,
            message = "Selected text cannot exceed 5000 characters."
    )
    private String selectedText;

    @NotNull(message = "Page number is required.")
    @Min(
            value = 1,
            message = "Page number must be greater than zero."
    )
    private Integer page;

    @NotEmpty(
            message = "At least one selection rectangle is required."
    )
    @Valid
    private List<AnnotationRectangleDTO> rectangles;

    @NotBlank(message = "Comment cannot be empty.")
    @Size(
            max = 1000,
            message = "Comment cannot exceed 1000 characters."
    )
    private String comment;

    @NotBlank(message = "Highlight color is required.")
    @Size(
            max = 30,
            message = "Color name is too long."
    )
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

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public List<AnnotationRectangleDTO> getRectangles() {
        return rectangles;
    }

    public void setRectangles(
            List<AnnotationRectangleDTO> rectangles) {

        this.rectangles = rectangles;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
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
                ", selectedText='" + selectedText + '\'' +
                ", page=" + page +
                ", rectangles=" + rectangles +
                ", comment='" + comment + '\'' +
                ", color='" + color + '\'' +
                '}';
    }
}