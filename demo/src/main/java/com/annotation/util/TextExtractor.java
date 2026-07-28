package com.annotation.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class TextExtractor {

    public static String extractFromTxt(MultipartFile file)
            throws IOException {

        return new String(
                file.getBytes(),
                StandardCharsets.UTF_8
        );
    }
}