package com.annotation.parser;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface DocumentParser {

    boolean supports(String fileName);

    String extractText(MultipartFile file) throws IOException;
}