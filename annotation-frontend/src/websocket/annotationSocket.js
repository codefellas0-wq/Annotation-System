import { Client } from "@stomp/stompjs";

const SOCKET_URL = "ws://localhost:8080/ws";

export const createAnnotationSocket = (
    documentId,
    onAnnotationReceived
) => {

    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("No JWT found. WebSocket connection skipped.");
        return null;
    }

    const client = new Client({

        brokerURL: SOCKET_URL,

        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },

        debug: (message) => {
            console.log("[STOMP]", message);
        },

        reconnectDelay: 5000,

        onConnect: () => {

            console.log(
                "WebSocket connected for document:",
                documentId
            );

            client.subscribe(
                `/topic/document/${documentId}`,
                (message) => {

                    try {

                        const annotation =
                            JSON.parse(message.body);

                        console.log(
                            "Real-time annotation received:",
                            annotation
                        );

                        onAnnotationReceived(annotation);

                    } catch (error) {

                        console.error(
                            "Failed to parse WebSocket message:",
                            error
                        );
                    }
                }
            );
        },

        onStompError: (frame) => {

            console.error(
                "STOMP error:",
                frame.headers["message"]
            );

            console.error(
                "Details:",
                frame.body
            );
        },

        onWebSocketError: (error) => {

            console.error(
                "WebSocket error:",
                error
            );
        },

        onDisconnect: () => {

            console.log(
                "WebSocket disconnected"
            );
        },
    });

    client.activate();

    return client;
};