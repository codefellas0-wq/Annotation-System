import api from "./axios";

export const getAnnotations = async (documentId) => {
    const response = await api.get(
        `/api/annotations/document/${documentId}`
    );

    return response.data;
};