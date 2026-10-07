import api from "./axios";


export const getDocuments = async () => {

    const response =
        await api.get("/api/documents");

    return response.data;
};


export const getDocumentById = async (
    documentId
) => {

    const response =
        await api.get(
            `/api/documents/${documentId}`
        );

    return response.data;
};


export const uploadDocument = async (
    file
) => {

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );


    const response =
        await api.post(
            "/api/documents/upload",
            formData
        );

    return response.data;
};


export const getOriginalDocument = async (
    documentId
) => {

    const response =
        await api.get(
            `/api/documents/${documentId}/file`,
            {
                responseType: "blob"
            }
        );

    return response.data;
};

