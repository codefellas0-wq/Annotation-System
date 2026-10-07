import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Document, Page, pdfjs } from "react-pdf";

import AnnotationSidebar from "../components/AnnotationSidebar";

import { getOriginalDocument } from "../api/documentApi";

import {
    createAnnotation,
    getAnnotationsByDocument,
    updateAnnotation,
    deleteAnnotation
} from "../api/annotationApi";

import { createAnnotationSocket } from "../websocket/annotationSocket";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import "./DocumentViewer.css";


pdfjs.GlobalWorkerOptions.workerSrc =
    `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


const DocumentViewer = () => {

    const { documentId } = useParams();
    const navigate = useNavigate();


    // =========================================================
    // PDF STATE
    // =========================================================

    const [fileUrl, setFileUrl] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // ANNOTATION STATE
    // =========================================================

    const [annotations, setAnnotations] = useState([]);

    const [selection, setSelection] = useState(null);
    const [showAnnotationPopup, setShowAnnotationPopup] =
        useState(false);

    const [comment, setComment] = useState("");
    const [color, setColor] = useState("yellow");
    const [savingAnnotation, setSavingAnnotation] =
        useState(false);


    // =========================================================
    // SELECTED / ACTIVE ANNOTATION
    // =========================================================

    const [activeAnnotationId, setActiveAnnotationId] =
        useState(null);

    const [selectedAnnotation, setSelectedAnnotation] =
        useState(null);


    // =========================================================
    // EDIT STATE
    // =========================================================

    const [editingAnnotation, setEditingAnnotation] =
        useState(null);

    const [editComment, setEditComment] = useState("");
    const [editColor, setEditColor] = useState("yellow");
    const [updatingAnnotation, setUpdatingAnnotation] =
        useState(false);


    // =========================================================
    // DELETE STATE
    // =========================================================

    const [deletingAnnotation, setDeletingAnnotation] =
        useState(false);

    const [showDeleteConfirmation, setShowDeleteConfirmation] =
        useState(false);


    // =========================================================
    // LOAD ORIGINAL DOCUMENT
    // =========================================================

    useEffect(() => {

        let objectUrl = null;

        const loadDocument = async () => {

            try {

                setLoading(true);
                setError("");

                const blob =
                    await getOriginalDocument(documentId);

                objectUrl =
                    URL.createObjectURL(blob);

                setFileUrl(objectUrl);

            } catch (error) {

                console.error(
                    "Failed to load document:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load document."
                );

            } finally {

                setLoading(false);

            }

        };

        loadDocument();

        return () => {

            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }

        };

    }, [documentId]);


    // =========================================================
    // LOAD EXISTING ANNOTATIONS
    // =========================================================

    useEffect(() => {

        const loadAnnotations = async () => {

            try {

                const response =
                    await getAnnotationsByDocument(
                        documentId
                    );

                let annotationPage;

                if (response?.data?.content) {
                    annotationPage = response.data;
                } else {
                    annotationPage = response;
                }

                const loadedAnnotations =
                    annotationPage?.content || [];

                setAnnotations(
                    loadedAnnotations
                );

            } catch (error) {

                console.error(
                    "Failed to load annotations:",
                    error
                );

            }

        };

        loadAnnotations();

    }, [documentId]);


    // =========================================================
    // REAL-TIME ANNOTATIONS
    // =========================================================

    useEffect(() => {

        if (!documentId) {
            return;
        }

        const socket =
            createAnnotationSocket(
                documentId,
                (incomingAnnotation) => {

                    setAnnotations(
                        (previousAnnotations) => {

                            const alreadyExists =
                                previousAnnotations.some(
                                    (annotation) =>
                                        annotation.id ===
                                        incomingAnnotation.id
                                );

                            if (alreadyExists) {
                                return previousAnnotations;
                            }

                            return [
                                ...previousAnnotations,
                                incomingAnnotation
                            ];

                        }
                    );

                }
            );

        return () => {

            if (socket) {
                socket.deactivate();
            }

        };

    }, [documentId]);


    // =========================================================
    // PDF LOAD
    // =========================================================

    const onDocumentLoadSuccess = ({
        numPages
    }) => {

        setNumPages(numPages);

    };


    // =========================================================
    // HIGHLIGHT COLORS
    // =========================================================

    const getHighlightColor = (
        annotationColor
    ) => {

        switch (
            annotationColor?.toLowerCase()
        ) {

            case "yellow":
                return "rgba(255, 235, 59, 0.45)";

            case "blue":
                return "rgba(33, 150, 243, 0.35)";

            case "green":
                return "rgba(76, 175, 80, 0.35)";

            default:
                return "rgba(255, 235, 59, 0.45)";

        }

    };


    // =========================================================
    // ANNOTATION SIDEBAR CLICK
    // =========================================================

    const handleAnnotationClick = (
        annotation
    ) => {

        setActiveAnnotationId(
            annotation.id
        );

        setSelectedAnnotation(
            annotation
        );

        const pageElement =
            document.getElementById(
                `pdf-page-${annotation.page}`
            );

        if (pageElement) {

            pageElement.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

        window.setTimeout(() => {

            setActiveAnnotationId(
                null
            );

        }, 2000);

    };


    // =========================================================
    // PDF HIGHLIGHT CLICK
    // =========================================================

    const handleHighlightClick = (
        annotation
    ) => {

        setSelectedAnnotation(
            annotation
        );

        setActiveAnnotationId(
            annotation.id
        );

    };


    // =========================================================
    // CLOSE DETAILS
    // =========================================================

    const closeAnnotationDetails = () => {

        setSelectedAnnotation(null);
        setActiveAnnotationId(null);

    };


    // =========================================================
    // START EDIT
    // =========================================================

    const handleStartEdit = (
        annotation
    ) => {

        setEditingAnnotation(
            annotation
        );

        setEditComment(
            annotation.comment || ""
        );

        setEditColor(
            annotation.color || "yellow"
        );

        setSelectedAnnotation(null);

    };


    // =========================================================
    // UPDATE ANNOTATION
    // =========================================================

    const handleUpdateAnnotation = async () => {

        if (!editingAnnotation) {
            return;
        }

        if (!editComment.trim()) {

            alert(
                "Comment cannot be blank."
            );

            return;

        }

        try {

            setUpdatingAnnotation(true);

            const updateData = {

                comment:
                    editComment.trim(),

                color:
                    editColor,

                // Kept for backend DTO compatibility.
                // Resolve/reopen is intentionally not exposed
                // as a frontend feature.
                resolved:
                    editingAnnotation.resolved ??
                    false

            };

            const response =
                await updateAnnotation(
                    editingAnnotation.id,
                    updateData
                );

            const updatedAnnotation =
                response?.data;

            if (!updatedAnnotation) {

                throw new Error(
                    "Updated annotation was not returned by the server."
                );

            }

            setAnnotations(
                (previousAnnotations) =>
                    previousAnnotations.map(
                        (annotation) =>
                            annotation.id ===
                            updatedAnnotation.id
                                ? updatedAnnotation
                                : annotation
                    )
            );

            setEditingAnnotation(null);
            setEditComment("");
            setEditColor("yellow");

            setSelectedAnnotation(
                updatedAnnotation
            );

            setActiveAnnotationId(
                updatedAnnotation.id
            );

        } catch (error) {

            console.error(
                "Failed to update annotation:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update annotation."
            );

        } finally {

            setUpdatingAnnotation(false);

        }

    };


    // =========================================================
    // CANCEL EDIT
    // =========================================================

    const handleCancelEdit = () => {

        setEditingAnnotation(null);
        setEditComment("");
        setEditColor("yellow");

    };


    // =========================================================
    // TEXT SELECTION
    // =========================================================

    useEffect(() => {

        const handleMouseUp = () => {

            const browserSelection =
                window.getSelection();

            if (
                !browserSelection ||
                browserSelection.isCollapsed
            ) {
                return;
            }

            const selectedText =
                browserSelection
                    .toString()
                    .trim();

            if (!selectedText) {
                return;
            }

            const range =
                browserSelection.getRangeAt(0);

            let currentElement =
                range.startContainer;

            if (
                currentElement.nodeType ===
                Node.TEXT_NODE
            ) {
                currentElement =
                    currentElement.parentElement;
            }

            const pageElement =
                currentElement?.closest(
                    ".react-pdf__Page"
                );

            if (!pageElement) {
                return;
            }

            const pageRect =
                pageElement.getBoundingClientRect();

            const clientRects =
                Array.from(
                    range.getClientRects()
                );

            const rectangles =
                clientRects
                    .map((rect) => ({
                        x:
                            rect.left -
                            pageRect.left,

                        y:
                            rect.top -
                            pageRect.top,

                        width:
                            rect.width,

                        height:
                            rect.height
                    }))
                    .filter(
                        (rect) =>
                            rect.width > 0 &&
                            rect.height > 0
                    );

            if (!rectangles.length) {
                return;
            }

            const pageNumber =
                Number(
                    pageElement.getAttribute(
                        "data-page-number"
                    )
                );

            if (!pageNumber) {

                console.warn(
                    "Could not determine PDF page number."
                );

                return;

            }

            setSelection({
                documentId,
                selectedText,
                page: pageNumber,
                rectangles
            });

            setComment("");
            setColor("yellow");
            setShowAnnotationPopup(true);

        };

        document.addEventListener(
            "mouseup",
            handleMouseUp
        );

        return () => {

            document.removeEventListener(
                "mouseup",
                handleMouseUp
            );

        };

    }, [documentId]);


    // =========================================================
    // SAVE NEW ANNOTATION
    // =========================================================

    const handleSaveAnnotation = async () => {

        if (!selection) {
            return;
        }

        if (!comment.trim()) {

            alert(
                "Please enter a comment."
            );

            return;

        }

        try {

            setSavingAnnotation(true);

            const annotationData = {

                documentId:
                    selection.documentId,

                selectedText:
                    selection.selectedText,

                page:
                    selection.page,

                rectangles:
                    selection.rectangles,

                comment:
                    comment.trim(),

                color

            };

            const response =
                await createAnnotation(
                    annotationData
                );

            const createdAnnotation =
                response?.data?.id
                    ? response.data
                    : response;

            if (
                createdAnnotation &&
                createdAnnotation.id
            ) {

                setAnnotations(
                    (previousAnnotations) => {

                        const alreadyExists =
                            previousAnnotations.some(
                                (annotation) =>
                                    annotation.id ===
                                    createdAnnotation.id
                            );

                        if (alreadyExists) {
                            return previousAnnotations;
                        }

                        return [
                            ...previousAnnotations,
                            createdAnnotation
                        ];

                    }
                );

            }

            handleCancelAnnotation();

        } catch (error) {

            console.error(
                "Failed to create annotation:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to create annotation."
            );

        } finally {

            setSavingAnnotation(false);

        }

    };


    // =========================================================
    // DELETE ANNOTATION
    // =========================================================

    const handleDeleteAnnotation = async () => {

        if (!selectedAnnotation) {
            return;
        }

        try {

            setDeletingAnnotation(true);

            await deleteAnnotation(
                selectedAnnotation.id
            );

            setAnnotations(
                (previousAnnotations) =>
                    previousAnnotations.filter(
                        (annotation) =>
                            annotation.id !==
                            selectedAnnotation.id
                    )
            );

            setSelectedAnnotation(null);
            setActiveAnnotationId(null);
            setShowDeleteConfirmation(false);

        } catch (error) {

            console.error(
                "Failed to delete annotation:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete annotation."
            );

        } finally {

            setDeletingAnnotation(false);

        }

    };


    // =========================================================
    // CANCEL NEW ANNOTATION
    // =========================================================

    const handleCancelAnnotation = () => {

        setShowAnnotationPopup(false);
        setSelection(null);
        setComment("");
        setColor("yellow");

        window
            .getSelection()
            ?.removeAllRanges();

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="document-status">

                <div className="document-status-spinner" />

                <h2>
                    Loading document
                </h2>

                <p>
                    Preparing the document viewer...
                </p>

            </div>

        );

    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (

            <div className="document-status">

                <div className="document-status-icon">
                    !
                </div>

                <h2>
                    Unable to open document
                </h2>

                <p>
                    {error}
                </p>

                <button
                    className="viewer-button primary"
                    onClick={() =>
                        navigate("/documents")
                    }
                >
                    Back to Documents
                </button>

            </div>

        );

    }


    // =========================================================
    // MAIN UI
    // =========================================================

    return (

        <div className="document-viewer">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="document-header">

                <div className="document-header-left">

                    <button
                        className="viewer-back-button"
                        onClick={() =>
                            navigate("/documents")
                        }
                    >
                        <span>
                            ←
                        </span>

                        Documents
                    </button>


                    <div className="document-header-divider" />


                    <div className="document-title">

                        <span>
                            DOCUMENT VIEWER
                        </span>

                        <h1>
                            Document
                        </h1>

                        <p>
                            ID: {documentId}
                        </p>

                    </div>

                </div>


                <div className="document-header-right">

                    <div className="page-count">

                        <strong>
                            {numPages || 0}
                        </strong>

                        <span>
                            pages
                        </span>

                    </div>


                    <button
                        className="viewer-button"
                        onClick={() =>
                            navigate("/documents")
                        }
                    >
                        All Documents
                    </button>

                </div>

            </header>


            {/* =================================================
                WORKSPACE
            ================================================= */}

            <div className="document-workspace">


                {/* =================================================
                    PDF AREA
                ================================================= */}

                <main className="pdf-container">

                    {fileUrl && (

                        <Document
                            file={fileUrl}
                            onLoadSuccess={
                                onDocumentLoadSuccess
                            }
                            onLoadError={(pdfError) => {

                                console.error(
                                    "PDF loading error:",
                                    pdfError
                                );

                                setError(
                                    "Unable to render this PDF."
                                );

                            }}
                            loading={null}
                        >

                            {Array.from(
                                new Array(
                                    numPages || 0
                                ),
                                (_, index) => {

                                    const pageNumber =
                                        index + 1;

                                    const pageAnnotations =
                                        annotations.filter(
                                            (annotation) =>
                                                Number(
                                                    annotation.page
                                                ) ===
                                                pageNumber
                                        );

                                    return (

                                        <div
                                            className="pdf-page-wrapper"
                                            id={
                                                `pdf-page-${pageNumber}`
                                            }
                                            key={
                                                `page_${pageNumber}`
                                            }
                                        >

                                            <div className="pdf-page-number">
                                                Page {pageNumber}
                                            </div>


                                            <Page
                                                pageNumber={
                                                    pageNumber
                                                }
                                                width={850}
                                            />


                                            <div
                                                className="annotation-layer"
                                            >

                                                {pageAnnotations.map(
                                                    (
                                                        annotation
                                                    ) => {

                                                        if (
                                                            !Array.isArray(
                                                                annotation.rectangles
                                                            )
                                                        ) {
                                                            return null;
                                                        }

                                                        return annotation
                                                            .rectangles
                                                            .map(
                                                                (
                                                                    rectangle,
                                                                    rectangleIndex
                                                                ) => {

                                                                    if (
                                                                        !rectangle
                                                                    ) {
                                                                        return null;
                                                                    }

                                                                    const isActive =
                                                                        annotation.id ===
                                                                        activeAnnotationId;

                                                                    return (

                                                                        <div
                                                                            key={
                                                                                `${annotation.id}-${rectangleIndex}`
                                                                            }
                                                                            className={
                                                                                isActive
                                                                                    ? "annotation-highlight active"
                                                                                    : "annotation-highlight"
                                                                            }
                                                                            onClick={(
                                                                                event
                                                                            ) => {

                                                                                event.stopPropagation();

                                                                                handleHighlightClick(
                                                                                    annotation
                                                                                );

                                                                            }}
                                                                            style={{
                                                                                left:
                                                                                    `${rectangle.x}px`,

                                                                                top:
                                                                                    `${rectangle.y}px`,

                                                                                width:
                                                                                    `${rectangle.width}px`,

                                                                                height:
                                                                                    `${rectangle.height}px`,

                                                                                backgroundColor:
                                                                                    getHighlightColor(
                                                                                        annotation.color
                                                                                    )
                                                                            }}
                                                                            title="Open annotation"
                                                                        />

                                                                    );

                                                                }
                                                            );

                                                    }
                                                )}

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </Document>

                    )}

                </main>


                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside className="annotation-sidebar-wrapper">

                    <div className="annotation-sidebar-heading">

                        <div>

                            <span>
                                ANNOTATIONS
                            </span>

                            <h2>
                                Document Notes
                            </h2>

                        </div>


                        <strong>
                            {annotations.length}
                        </strong>

                    </div>


                    <AnnotationSidebar
                        annotations={
                            annotations
                        }
                        onAnnotationClick={
                            handleAnnotationClick
                        }
                    />

                </aside>

            </div>


            {/* =================================================
                NEW ANNOTATION POPUP
            ================================================= */}

            {showAnnotationPopup &&
                selection && (

                    <div className="annotation-popup">

                        <div className="annotation-popup-header">

                            <div>

                                <span>
                                    NEW ANNOTATION
                                </span>

                                <h3>
                                    Add note
                                </h3>

                            </div>


                            <button
                                type="button"
                                className="modal-close-button"
                                onClick={
                                    handleCancelAnnotation
                                }
                                aria-label="Close"
                            >
                                ×
                            </button>

                        </div>


                        <div className="selected-text">

                            <label>
                                Selected text
                            </label>

                            <p>
                                "{selection.selectedText}"
                            </p>

                        </div>


                        <div className="annotation-field">

                            <label>
                                Comment
                            </label>

                            <textarea
                                value={comment}
                                onChange={(event) =>
                                    setComment(
                                        event.target.value
                                    )
                                }
                                placeholder="Add your comment..."
                                maxLength={1000}
                            />

                            <small>
                                {comment.length}/1000
                            </small>

                        </div>


                        <div className="annotation-field">

                            <label>
                                Highlight color
                            </label>

                            <div className="color-options">

                                {[
                                    "yellow",
                                    "blue",
                                    "green"
                                ].map(
                                    (option) => (

                                        <button
                                            key={option}
                                            type="button"
                                            className={
                                                color === option
                                                    ? `color-button ${option} selected`
                                                    : `color-button ${option}`
                                            }
                                            onClick={() =>
                                                setColor(
                                                    option
                                                )
                                            }
                                        >
                                            <span />
                                            {option}
                                        </button>

                                    )
                                )}

                            </div>

                        </div>


                        <div className="annotation-popup-actions">

                            <button
                                type="button"
                                className="viewer-button"
                                onClick={
                                    handleCancelAnnotation
                                }
                                disabled={
                                    savingAnnotation
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                className="viewer-button primary"
                                onClick={
                                    handleSaveAnnotation
                                }
                                disabled={
                                    savingAnnotation ||
                                    !comment.trim()
                                }
                            >
                                {savingAnnotation
                                    ? "Saving..."
                                    : "Save annotation"}
                            </button>

                        </div>

                    </div>

                )}


            {/* =================================================
                DETAILS MODAL
            ================================================= */}

            {selectedAnnotation && (

                <div
                    className="annotation-modal-backdrop"
                    onClick={
                        closeAnnotationDetails
                    }
                >

                    <div
                        className="annotation-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="annotation-details-header">

                            <div>

                                <span>
                                    ANNOTATION DETAILS
                                </span>

                                <h3>
                                    Note
                                </h3>

                            </div>


                            <button
                                type="button"
                                className="modal-close-button"
                                onClick={
                                    closeAnnotationDetails
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="annotation-details-color">

                            <span
                                className={`annotation-color-dot ${selectedAnnotation.color || "yellow"}`}
                            />

                            <span>
                                {selectedAnnotation.color ||
                                    "yellow"}
                            </span>

                        </div>


                        <div className="annotation-detail-section">

                            <label>
                                Selected text
                            </label>

                            <p className="annotation-detail-selected-text">
                                "{selectedAnnotation.selectedText}"
                            </p>

                        </div>


                        <div className="annotation-detail-section">

                            <label>
                                Comment
                            </label>

                            <p className="annotation-detail-comment">
                                {selectedAnnotation.comment ||
                                    "No comment"}
                            </p>

                        </div>


                        <div className="annotation-detail-meta">

                            <div>
                                <span>
                                    Author
                                </span>

                                <strong>
                                    {selectedAnnotation.authorId ||
                                        "Unknown"}
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Page
                                </span>

                                <strong>
                                    {selectedAnnotation.page ||
                                        "Unknown"}
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Created
                                </span>

                                <strong>
                                    {selectedAnnotation.createdAt
                                        ? new Date(
                                            selectedAnnotation.createdAt
                                        ).toLocaleDateString(
                                            "en-IN"
                                        )
                                        : "—"}
                                </strong>
                            </div>

                        </div>


                        <div className="annotation-details-actions">

                            <button
                                type="button"
                                className="viewer-button"
                                onClick={() =>
                                    handleStartEdit(
                                        selectedAnnotation
                                    )
                                }
                            >
                                Edit
                            </button>


                            <button
                                type="button"
                                className="viewer-button danger"
                                onClick={() =>
                                    setShowDeleteConfirmation(
                                        true
                                    )
                                }
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                DELETE CONFIRMATION
            ================================================= */}

            {showDeleteConfirmation &&
                selectedAnnotation && (

                    <div
                        className="annotation-modal-backdrop"
                        onClick={() =>
                            setShowDeleteConfirmation(
                                false
                            )
                        }
                    >

                        <div
                            className="annotation-modal confirmation-modal"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >

                            <div className="annotation-details-header">

                                <div>

                                    <span>
                                        CONFIRM ACTION
                                    </span>

                                    <h3>
                                        Delete annotation?
                                    </h3>

                                </div>


                                <button
                                    type="button"
                                    className="modal-close-button"
                                    onClick={() =>
                                        setShowDeleteConfirmation(
                                            false
                                        )
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            <div className="delete-confirmation-content">

                                <div className="delete-icon">
                                    !
                                </div>


                                <p>
                                    This annotation and its
                                    highlight will be removed.
                                </p>


                                <strong>
                                    This action cannot be undone.
                                </strong>

                            </div>


                            <div className="annotation-popup-actions">

                                <button
                                    type="button"
                                    className="viewer-button"
                                    onClick={() =>
                                        setShowDeleteConfirmation(
                                            false
                                        )
                                    }
                                    disabled={
                                        deletingAnnotation
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    className="viewer-button danger"
                                    onClick={
                                        handleDeleteAnnotation
                                    }
                                    disabled={
                                        deletingAnnotation
                                    }
                                >
                                    {deletingAnnotation
                                        ? "Deleting..."
                                        : "Delete annotation"}
                                </button>

                            </div>

                        </div>

                    </div>

                )}


            {/* =================================================
                EDIT MODAL
            ================================================= */}

            {editingAnnotation && (

                <div
                    className="annotation-modal-backdrop"
                    onClick={
                        handleCancelEdit
                    }
                >

                    <div
                        className="annotation-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="annotation-details-header">

                            <div>

                                <span>
                                    EDIT ANNOTATION
                                </span>

                                <h3>
                                    Update note
                                </h3>

                            </div>


                            <button
                                type="button"
                                className="modal-close-button"
                                onClick={
                                    handleCancelEdit
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="annotation-detail-section">

                            <label>
                                Selected text
                            </label>

                            <p className="annotation-detail-selected-text">
                                "{editingAnnotation.selectedText}"
                            </p>

                        </div>


                        <div className="annotation-field">

                            <label>
                                Comment
                            </label>

                            <textarea
                                value={editComment}
                                onChange={(event) =>
                                    setEditComment(
                                        event.target.value
                                    )
                                }
                                maxLength={500}
                                placeholder="Update your comment..."
                            />

                            <small>
                                {editComment.length}/500
                            </small>

                        </div>


                        <div className="annotation-field">

                            <label>
                                Highlight color
                            </label>

                            <div className="color-options">

                                {[
                                    "yellow",
                                    "blue",
                                    "green"
                                ].map(
                                    (option) => (

                                        <button
                                            key={option}
                                            type="button"
                                            className={
                                                editColor === option
                                                    ? `color-button ${option} selected`
                                                    : `color-button ${option}`
                                            }
                                            onClick={() =>
                                                setEditColor(
                                                    option
                                                )
                                            }
                                        >
                                            <span />
                                            {option}
                                        </button>

                                    )
                                )}

                            </div>

                        </div>


                        <div className="annotation-popup-actions">

                            <button
                                type="button"
                                className="viewer-button"
                                onClick={
                                    handleCancelEdit
                                }
                                disabled={
                                    updatingAnnotation
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                className="viewer-button primary"
                                onClick={
                                    handleUpdateAnnotation
                                }
                                disabled={
                                    updatingAnnotation ||
                                    !editComment.trim()
                                }
                            >
                                {updatingAnnotation
                                    ? "Updating..."
                                    : "Save changes"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

};


export default DocumentViewer;


