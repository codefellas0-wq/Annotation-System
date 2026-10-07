import api from "./axios";

export const createAnnotation = async (annotationData) => {

    const response = await api.post(
        "/api/annotations",
        annotationData
    );

    console.log(
        "Create annotation API response:",
        response.data
    );

    // Your backend response:
    // {
    //   success: true,
    //   message: "...",
    //   data: { annotation }
    // }

    return response.data.data;
};


export const getAnnotationsByDocument = async (
    documentId
) => {

    const response = await api.get(
        `/api/annotations/document/${documentId}`
    );

    console.log(
        "Get annotations API response:",
        response.data
    );

    // Your backend response:
    //
    // response.data
    //       ↓
    // data
    //       ↓
    // content

    return response.data.data;
};
export const updateAnnotation = async (
    annotationId,
    updateData
) => {

    const response = await api.put(
        `/api/annotations/${annotationId}`,
        updateData
    );

    return response.data;
};

export const deleteAnnotation = async (
    annotationId
) => {

    const response = await api.delete(
        `/api/annotations/${annotationId}`
    );

    return response.data;
};