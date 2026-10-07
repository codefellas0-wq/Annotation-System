package com.annotation.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.annotation.model.AnnotationEntity;

@Component
public class AnnotationEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public AnnotationEventPublisher(
            SimpMessagingTemplate messagingTemplate) {

        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Broadcast newly created annotation.
     */
    public void publishAnnotationCreated(
            AnnotationEntity annotation) {

        String destination =
                "/topic/document/" +
                        annotation.getDocumentId();

        messagingTemplate.convertAndSend(
                destination,
                annotation);
    }
}