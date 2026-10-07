package com.annotation.model;

public class AnnotationRectangle {

    private Double x;

    private Double y;

    private Double width;

    private Double height;

    public AnnotationRectangle() {
    }

    public AnnotationRectangle(
            Double x,
            Double y,
            Double width,
            Double height) {

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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
        return "AnnotationRectangle{" +
                "x=" + x +
                ", y=" + y +
                ", width=" + width +
                ", height=" + height +
                '}';
    }
}