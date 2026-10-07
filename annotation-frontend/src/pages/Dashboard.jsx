import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getDocuments,
    uploadDocument
} from "../api/documentApi";

import "./Dashboard.css";


const Dashboard = () => {

    const navigate = useNavigate();

    const fileInputRef = useRef(null);


    // =========================================================
    // STATE
    // =========================================================

    const [documents, setDocuments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [uploading, setUploading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    const [fileTypeFilter, setFileTypeFilter] =
        useState("all");


    // =========================================================
    // FETCH DOCUMENTS
    // =========================================================

    const fetchDocuments = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getDocuments();


            /*
             * The project has used different response
             * shapes during development, so normalize
             * the response here instead of spreading
             * response-shape logic throughout the UI.
             */

            let loadedDocuments = [];


            if (Array.isArray(response)) {

                loadedDocuments =
                    response;

            } else if (
                Array.isArray(response?.data)
            ) {

                loadedDocuments =
                    response.data;

            } else if (
                Array.isArray(response?.content)
            ) {

                loadedDocuments =
                    response.content;

            } else {

                loadedDocuments = [];

            }


            setDocuments(
                loadedDocuments
            );


        } catch (error) {

            console.error(
                "Failed to fetch documents:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to load your documents."
            );


        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchDocuments();

    }, []);


    // =========================================================
    // UPLOAD
    // =========================================================

    const handleUploadClick = () => {

        if (uploading) {
            return;
        }

        fileInputRef.current?.click();

    };


    const handleUpload = async (
        event
    ) => {

        const file =
            event.target.files?.[0];


        if (!file) {
            return;
        }


        try {

            setUploading(true);

            setError("");


            console.log(
                "Selected file:",
                file
            );


            await uploadDocument(
                file
            );


            /*
             * Refresh the list after successful
             * upload so the new document appears
             * from the backend source of truth.
             */

            await fetchDocuments();


        } catch (error) {

            console.error(
                "Upload failed:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Document upload failed. Please try again."
            );


        } finally {

            setUploading(false);


            /*
             * Allow the same file to be
             * selected again.
             */

            event.target.value = "";

        }

    };


    // =========================================================
    // FILTERED DOCUMENTS
    // =========================================================

    const filteredDocuments =
        useMemo(() => {

            const normalizedSearch =
                searchTerm
                    .trim()
                    .toLowerCase();


            return documents.filter(
                (document) => {

                    const fileName =
                        document.fileName
                            ?.toLowerCase() ||
                        "";


                    const contentType =
                        document.contentType
                            ?.toLowerCase() ||
                        "";


                    /*
                     * Search
                     */

                    const matchesSearch =
                        !normalizedSearch ||
                        fileName.includes(
                            normalizedSearch
                        );


                    /*
                     * File type
                     */

                    let matchesType =
                        true;


                    if (
                        fileTypeFilter ===
                        "pdf"
                    ) {

                        matchesType =
                            contentType.includes(
                                "pdf"
                            );

                    }


                    if (
                        fileTypeFilter ===
                        "document"
                    ) {

                        matchesType =
                            contentType.includes(
                                "word"
                            ) ||
                            contentType.includes(
                                "document"
                            ) ||
                            contentType.includes(
                                "text"
                            );

                    }


                    return (
                        matchesSearch &&
                        matchesType
                    );

                }
            );

        }, [
            documents,
            searchTerm,
            fileTypeFilter
        ]);


    // =========================================================
    // DASHBOARD STATISTICS
    // =========================================================

    const totalDocuments =
        documents.length;


    const pdfDocuments =
        documents.filter(
            (document) =>
                document.contentType
                    ?.toLowerCase()
                    .includes("pdf")
        ).length;


    const otherDocuments =
        totalDocuments -
        pdfDocuments;


    const totalCharacters =
        documents.reduce(
            (
                total,
                document
            ) => {

                return (
                    total +
                    (
                        Number(
                            document.totalCharacters
                        ) || 0
                    )
                );

            },
            0
        );


    // =========================================================
    // HELPERS
    // =========================================================

    const getFileType = (
        document
    ) => {

        const contentType =
            document.contentType
                ?.toLowerCase() ||
            "";


        if (
            contentType.includes("pdf")
        ) {

            return "PDF";

        }


        if (
            contentType.includes("word")
        ) {

            return "DOCX";

        }


        if (
            contentType.includes("text")
        ) {

            return "TXT";

        }


        return "FILE";

    };


    const getFileIcon = (
        document
    ) => {

        const type =
            getFileType(
                document
            );


        if (type === "PDF") {
            return "PDF";
        }

        if (type === "DOCX") {
            return "DOC";
        }

        if (type === "TXT") {
            return "TXT";
        }

        return "FILE";

    };


    const formatCharacters = (
        value
    ) => {

        const number =
            Number(value) || 0;


        return new Intl.NumberFormat(
            "en-IN"
        ).format(number);

    };


    const formatDate = (
        value
    ) => {

        if (!value) {
            return "—";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "—";

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="dashboard">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <section className="dashboard-header">

                <div>

                    <p className="dashboard-eyebrow">
                        WORKSPACE
                    </p>


                    <h1>
                        Your documents
                    </h1>


                    <p className="dashboard-description">
                        Upload, manage and annotate
                        your documents from one workspace.
                    </p>

                </div>


                <div className="dashboard-header-actions">

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.txt,.doc,.docx"
                        onChange={
                            handleUpload
                        }
                        hidden
                    />


                    <button
                        className="primary-button"
                        onClick={
                            handleUploadClick
                        }
                        disabled={
                            uploading
                        }
                    >

                        <span className="button-icon">
                            +
                        </span>

                        {uploading
                            ? "Uploading..."
                            : "Upload document"}

                    </button>

                </div>

            </section>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="dashboard-alert">

                    <span>
                        {error}
                    </span>


                    <button
                        type="button"
                        onClick={() =>
                            setError("")
                        }
                    >
                        ×
                    </button>

                </div>

            )}


            {/* =================================================
                OVERVIEW
            ================================================= */}

            <section className="stats-grid">


                <div className="stat-card">

                    <div className="stat-card-top">

                        <span className="stat-label">
                            Total documents
                        </span>

                        <span className="stat-icon">
                            ▣
                        </span>

                    </div>


                    <strong className="stat-value">
                        {totalDocuments}
                    </strong>


                    <span className="stat-description">
                        Documents in your workspace
                    </span>

                </div>


                <div className="stat-card">

                    <div className="stat-card-top">

                        <span className="stat-label">
                            PDF documents
                        </span>

                        <span className="stat-icon pdf">
                            PDF
                        </span>

                    </div>


                    <strong className="stat-value">
                        {pdfDocuments}
                    </strong>


                    <span className="stat-description">
                        Ready for annotation
                    </span>

                </div>


                <div className="stat-card">

                    <div className="stat-card-top">

                        <span className="stat-label">
                            Other files
                        </span>

                        <span className="stat-icon document">
                            DOC
                        </span>

                    </div>


                    <strong className="stat-value">
                        {otherDocuments}
                    </strong>


                    <span className="stat-description">
                        Documents and text files
                    </span>

                </div>


                <div className="stat-card">

                    <div className="stat-card-top">

                        <span className="stat-label">
                            Total characters
                        </span>

                        <span className="stat-icon">
                            Aa
                        </span>

                    </div>


                    <strong className="stat-value">
                        {formatCharacters(
                            totalCharacters
                        )}
                    </strong>


                    <span className="stat-description">
                        Extracted document content
                    </span>

                </div>

            </section>


            {/* =================================================
                DOCUMENTS
            ================================================= */}

            <section className="documents-section">


                <div className="section-header">

                    <div>

                        <h2>
                            Documents
                        </h2>

                        <p>
                            Manage the documents in your workspace.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="view-all-button"
                        onClick={() =>
                            navigate("/documents")
                        }
                    >
                        View all →
                    </button>


                    <span className="document-count">

                        {filteredDocuments.length}
                        {" "}
                        {filteredDocuments.length === 1
                            ? "document"
                            : "documents"}

                    </span>

                </div>


                {/* =================================================
                    SEARCH / FILTER
                ================================================= */}

                <div className="document-toolbar">

                    <div className="search-box">

                        <span className="search-icon">
                            ⌕
                        </span>


                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={
                                searchTerm
                            }
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <select
                        className="document-filter"
                        value={
                            fileTypeFilter
                        }
                        onChange={(event) =>
                            setFileTypeFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="all">
                            All files
                        </option>

                        <option value="pdf">
                            PDF
                        </option>

                        <option value="document">
                            Documents
                        </option>

                    </select>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div className="dashboard-state">

                        <div className="loading-spinner" />

                        <h3>
                            Loading documents
                        </h3>

                        <p>
                            Fetching your workspace...
                        </p>

                    </div>

                )}


                {/* =================================================
                    EMPTY — NO DOCUMENTS
                ================================================= */}

                {!loading &&
                    documents.length === 0 && (

                        <div className="dashboard-empty">

                            <div className="empty-icon">
                                +
                            </div>


                            <h3>
                                No documents yet
                            </h3>


                            <p>
                                Upload your first PDF,
                                DOCX or text document
                                to start annotating.
                            </p>


                            <button
                                className="primary-button"
                                onClick={
                                    handleUploadClick
                                }
                            >
                                Upload your first document
                            </button>

                        </div>

                    )}


                {/* =================================================
                    EMPTY — SEARCH/FILTER
                ================================================= */}

                {!loading &&
                    documents.length > 0 &&
                    filteredDocuments.length === 0 && (

                        <div className="dashboard-empty compact">

                            <div className="empty-icon">
                                ⌕
                            </div>


                            <h3>
                                No matching documents
                            </h3>


                            <p>
                                Try a different search
                                term or file type.
                            </p>


                            <button
                                className="secondary-button"
                                onClick={() => {

                                    setSearchTerm("");

                                    setFileTypeFilter(
                                        "all"
                                    );

                                }}
                            >
                                Clear filters
                            </button>

                        </div>

                    )}


                {/* =================================================
                    DOCUMENT LIST
                ================================================= */}

                {!loading &&
                    filteredDocuments.length > 0 && (

                        <div className="document-list">

                            {filteredDocuments.map(
                                (document) => (

                                    <article
                                        className="document-card"
                                        key={
                                            document.id
                                        }
                                    >

                                        <div className="document-file-icon">

                                            {getFileIcon(
                                                document
                                            )}

                                        </div>


                                        <div className="document-info">

                                            <h3
                                                title={
                                                    document.fileName
                                                }
                                            >
                                                {document.fileName}
                                            </h3>


                                            <div className="document-meta">

                                                <span>
                                                    {
                                                        getFileType(
                                                            document
                                                        )
                                                    }
                                                </span>


                                                <span>
                                                    •
                                                </span>


                                                <span>
                                                    {
                                                        formatCharacters(
                                                            document.totalCharacters
                                                        )
                                                    }
                                                    {" "}
                                                    characters
                                                </span>


                                                <span>
                                                    •
                                                </span>


                                                <span>
                                                    {
                                                        formatDate(
                                                            document.uploadedAt
                                                        )
                                                    }
                                                </span>

                                            </div>

                                        </div>


                                        <div className="document-card-actions">

                                            <button
                                                className="open-document-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/documents/${document.id}`
                                                    )
                                                }
                                            >
                                                Open
                                            </button>


                                            <button
                                                className="document-arrow-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/documents/${document.id}`
                                                    )
                                                }
                                                aria-label={
                                                    `Open ${document.fileName}`
                                                }
                                            >
                                                →
                                            </button>

                                        </div>

                                    </article>

                                )
                            )}

                        </div>

                    )}

            </section>

        </div>

    );

};


export default Dashboard;