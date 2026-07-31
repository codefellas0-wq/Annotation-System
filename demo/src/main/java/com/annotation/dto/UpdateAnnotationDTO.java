package com.annotation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UpdateAnnotationDTO {

    @NotBlank(message = "Comment cannot be blank.")
    @Size(max = 500, message = "Comment cannot exceed 500 characters.")
    private String comment;

    @NotBlank(message = "Color cannot be blank.")
    private String color;

    @NotNull(message = "Resolved status is required.")
    private Boolean resolved;

    public UpdateAnnotationDTO() {
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

    public Boolean getResolved() {
        return resolved;
    }

    public void setResolved(Boolean resolved) {
        this.resolved = resolved;
    }

    @Override
    public String toString() {
        return "UpdateAnnotationDTO{" +
                "comment='" + comment + '\'' +
                ", color='" + color + '\'' +
                ", resolved=" + resolved +
                '}';
    }
}