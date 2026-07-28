package com.annotation.dto;

public class DocumentRequest {

    private String fileName;

    private String contentType;

    private String extractedText;

    // Default Constructor
    public DocumentRequest() {
    }

    // Parameterized Constructor
    public DocumentRequest(String fileName,
                           String contentType,
                           String extractedText) {

        this.fileName = fileName;
        this.contentType = contentType;
        this.extractedText = extractedText;
    }

    // Getters

    public String getFileName() {
        return fileName;
    }

    public String getContentType() {
        return contentType;
    }

    public String getExtractedText() {
        return extractedText;
    }

    // Setters

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public void setExtractedText(String extractedText) {
        this.extractedText = extractedText;
    }

    @Override
    public String toString() {
        return "DocumentRequest{" +
                "fileName='" + fileName + '\'' +
                ", contentType='" + contentType + '\'' +
                ", extractedText='" + extractedText + '\'' +
                '}';
    }
}