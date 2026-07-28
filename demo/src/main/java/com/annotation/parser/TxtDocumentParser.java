package com.annotation.parser;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class TxtDocumentParser implements DocumentParser {

    @Override
    public boolean supports(String fileName) {
        return fileName.toLowerCase().endsWith(".txt");
    }

    @Override
    public String extractText(MultipartFile file) throws IOException {
        return new String(file.getBytes(), StandardCharsets.UTF_8);
    }
}