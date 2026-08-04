package com.annotation.controller;

import com.annotation.dto.AnnotationDTO;
import com.annotation.service.AnnotationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AnnotationController.class)
class AnnotationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AnnotationService annotationService;

    @Test
    void createAnnotation_shouldRejectInvalidOffsetRange() throws Exception {
        AnnotationDTO request = new AnnotationDTO();
        request.setDocumentId("doc-1");
        request.setSelectedText("selected text");
        request.setComment("This is a comment");
        request.setAuthor("Naresh");
        request.setStartOffset(10);
        request.setEndOffset(20);
        request.setColor("yellow");

        mockMvc.perform(post("/api/annotations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
