package com.annotation.service;

import com.annotation.dto.DocumentRequest;
import com.annotation.exception.UnsupportedFileTypeException;
import com.annotation.model.DocumentEntity;
import com.annotation.repository.DocumentRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.annotation.parser.DocumentParser;
import java.util.List;
import java.io.IOException;
import java.time.LocalDateTime;


@Service
public class DocumentService {

   private final DocumentRepository documentRepository;
private final List<DocumentParser> parsers;

public DocumentService(DocumentRepository documentRepository,
                       List<DocumentParser> parsers) {
    this.documentRepository = documentRepository;
    this.parsers = parsers;
}
    public DocumentEntity uploadDocument(MultipartFile file) {

        // Validate file
        if (file.isEmpty()) {
            throw new RuntimeException("File cannot be empty.");
        }

        if (file.getOriginalFilename() == null ||
                file.getOriginalFilename().isBlank()) {
            throw new RuntimeException("Invalid file name.");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("Maximum file size is 10 MB.");
        }

        String fileName = file.getOriginalFilename().toLowerCase();

        if (!(fileName.endsWith(".txt")
                || fileName.endsWith(".pdf")
                || fileName.endsWith(".docx"))) {

            throw new RuntimeException("Only TXT, PDF and DOCX files are allowed.");
        }

        try {

            // For now, extract only TXT files
            String extractedText = null;

for (DocumentParser parser : parsers) {

    if (parser.supports(fileName)) {
        extractedText = parser.extractText(file);
        break;
    }
}

if (extractedText == null) {
    throw new UnsupportedFileTypeException(
    "No parser available for this file type."
);
}
            // Create entity
            DocumentEntity document = new DocumentEntity();

            document.setFileName(file.getOriginalFilename());
            document.setContentType(file.getContentType());
            document.setExtractedText(extractedText);
            document.setTotalCharacters((long) extractedText.length());
            document.setUploadedAt(LocalDateTime.now());

            // Save to MongoDB
            return documentRepository.save(document);

        } catch (IOException e) {
            throw new RuntimeException("Failed to read uploaded file.", e);
        }
    }
    public DocumentEntity saveDocument(DocumentRequest request) {

    DocumentEntity document = new DocumentEntity();

    document.setFileName(request.getFileName());
    document.setContentType(request.getContentType());
    document.setExtractedText(request.getExtractedText());
    document.setTotalCharacters((long) request.getExtractedText().length());
    document.setUploadedAt(LocalDateTime.now());

    return documentRepository.save(document);
}
}