package com.annotation.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class AnnotationRectangleDTO {

    @NotNull(message = "Rectangle X coordinate is required.")
    @DecimalMin(
            value = "0.0",
            inclusive = true,
            message = "Rectangle X coordinate cannot be negative."
    )
    private Double x;

    @NotNull(message = "Rectangle Y coordinate is required.")
    @DecimalMin(
            value = "0.0",
            inclusive = true,
            message = "Rectangle Y coordinate cannot be negative."
    )
    private Double y;

    @NotNull(message = "Rectangle width is required.")
    @DecimalMin(
            value = "0.0",
            inclusive = false,
            message = "Rectangle width must be greater than zero."
    )
    private Double width;

    @NotNull(message = "Rectangle height is required.")
    @DecimalMin(
            value = "0.0",
            inclusive = false,
            message = "Rectangle height must be greater than zero."
    )
    private Double height;

    public AnnotationRectangleDTO() {
    }

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public Double getWidth() {
        return width;
    }

    public void setWidth(Double width) {
        this.width = width;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    @Override
    public String toString() {
        return "AnnotationRectangleDTO{" +
                "x=" + x +
                ", y=" + y +
                ", width=" + width +
                ", height=" + height +
                '}';
    }
}