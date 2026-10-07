import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getDocuments,
    uploadDocument
} from "../api/documentApi";

import "./Documents.css";


const Documents = () => {

    const navigate = useNavigate();
    const fileInputRef = useRef(null);


    // =========================================================
    // STATE
    // =========================================================

    const [documents, setDocuments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const [fileType, setFileType] = useState("all");

    const [sortBy, setSortBy] = useState("newest");


    // =========================================================
    // LOAD DOCUMENTS
    // =========================================================

    const fetchDocuments = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getDocuments();

            let loadedDocuments = [];

            if (Array.isArray(response)) {

                loadedDocuments = response;

            } else if (
                Array.isArray(response?.data)
            ) {

                loadedDocuments = response.data;

            } else if (
                Array.isArray(response?.content)
            ) {

                loadedDocuments = response.content;

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
                "Unable to load documents."
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

            await uploadDocument(file);

            await fetchDocuments();

        } catch (error) {

            console.error(
                "Upload failed:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Document upload failed."
            );

        } finally {

            setUploading(false);

            event.target.value = "";

        }

    };


    // =========================================================
    // HELPERS
    // =========================================================

    const getFileType = (
        document
    ) => {

        const contentType =
            document.contentType
                ?.toLowerCase() || "";


        if (
            contentType.includes("pdf")
        ) {
            return "PDF";
        }


        if (
            contentType.includes("word") ||
            contentType.includes("docx")
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

        return getFileType(
            document
        );

    };


    const formatCharacters = (
        value
    ) => {

        return new Intl.NumberFormat(
            "en-IN"
        ).format(
            Number(value) || 0
        );

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
    // FILTER + SORT
    // =========================================================

    const filteredDocuments =
        useMemo(() => {

            const search =
                searchTerm
                    .trim()
                    .toLowerCase();


            const result =
                documents.filter(
                    (document) => {

                        const fileName =
                            document.fileName
                                ?.toLowerCase() ||
                            "";

                        const type =
                            getFileType(
                                document
                            );


                        const matchesSearch =
                            !search ||
                            fileName.includes(
                                search
                            );


                        const matchesType =
                            fileType === "all" ||
                            type === fileType;


                        return (
                            matchesSearch &&
                            matchesType
                        );

                    }
                );


            return result.sort(
                (a, b) => {

                    if (
                        sortBy === "name"
                    ) {

                        return (
                            (a.fileName || "")
                                .localeCompare(
                                    b.fileName || ""
                                )
                        );

                    }


                    const dateA =
                        new Date(
                            a.uploadedAt || 0
                        ).getTime();


                    const dateB =
                        new Date(
                            b.uploadedAt || 0
                        ).getTime();


                    if (
                        sortBy === "oldest"
                    ) {

                        return dateA - dateB;

                    }


                    return dateB - dateA;

                }
            );

        }, [
            documents,
            searchTerm,
            fileType,
            sortBy
        ]);


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="documents-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <section className="documents-page-header">

                <div>

                    <p className="documents-eyebrow">
                        WORKSPACE
                    </p>

                    <h1>
                        Documents
                    </h1>

                    <p>
                        Manage and open all documents
                        available in your workspace.
                    </p>

                </div>


                <div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.txt,.doc,.docx"
                        hidden
                        onChange={
                            handleUpload
                        }
                    />


                    <button
                        className="documents-primary-button"
                        onClick={
                            handleUploadClick
                        }
                        disabled={
                            uploading
                        }
                    >

                        <span>
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

                <div className="documents-alert">

                    <span>
                        {error}
                    </span>


                    <button
                        onClick={() =>
                            setError("")
                        }
                    >
                        ×
                    </button>

                </div>

            )}


            {/* =================================================
                DOCUMENT WORKSPACE
            ================================================= */}

            <section className="documents-container">


                {/* TOOLBAR */}

                <div className="documents-toolbar">


                    <div className="documents-search">

                        <span>
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
                        value={fileType}
                        onChange={(event) =>
                            setFileType(
                                event.target.value
                            )
                        }
                    >

                        <option value="all">
                            All file types
                        </option>

                        <option value="PDF">
                            PDF
                        </option>

                        <option value="DOCX">
                            DOCX
                        </option>

                        <option value="TXT">
                            TXT
                        </option>

                    </select>


                    <select
                        value={sortBy}
                        onChange={(event) =>
                            setSortBy(
                                event.target.value
                            )
                        }
                    >

                        <option value="newest">
                            Newest first
                        </option>

                        <option value="oldest">
                            Oldest first
                        </option>

                        <option value="name">
                            Name A-Z
                        </option>

                    </select>

                </div>


                {/* RESULT SUMMARY */}

                {!loading && (

                    <div className="documents-result-summary">

                        <span>

                            Showing{" "}

                            <strong>
                                {
                                    filteredDocuments.length
                                }
                            </strong>

                            {" "}

                            {filteredDocuments.length === 1
                                ? "document"
                                : "documents"}

                        </span>


                        {(searchTerm ||
                            fileType !== "all") && (

                            <button
                                onClick={() => {

                                    setSearchTerm("");

                                    setFileType(
                                        "all"
                                    );

                                }}
                            >
                                Clear filters
                            </button>

                        )}

                    </div>

                )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div className="documents-state">

                        <div className="documents-spinner" />

                        <h3>
                            Loading documents
                        </h3>

                        <p>
                            Fetching your documents...
                        </p>

                    </div>

                )}


                {/* =================================================
                    EMPTY DATABASE
                ================================================= */}

                {!loading &&
                    documents.length === 0 && (

                        <div className="documents-state">

                            <div className="documents-empty-icon">
                                ▣
                            </div>

                            <h3>
                                No documents yet
                            </h3>

                            <p>
                                Upload a document to
                                start annotating.
                            </p>

                            <button
                                className="documents-primary-button"
                                onClick={
                                    handleUploadClick
                                }
                            >
                                Upload document
                            </button>

                        </div>

                    )}


                {/* =================================================
                    NO SEARCH RESULTS
                ================================================= */}

                {!loading &&
                    documents.length > 0 &&
                    filteredDocuments.length === 0 && (

                        <div className="documents-state">

                            <div className="documents-empty-icon">
                                ⌕
                            </div>

                            <h3>
                                No matching documents
                            </h3>

                            <p>
                                Try changing your search
                                or filter.
                            </p>

                            <button
                                className="documents-secondary-button"
                                onClick={() => {

                                    setSearchTerm("");

                                    setFileType(
                                        "all"
                                    );

                                }}
                            >
                                Clear filters
                            </button>

                        </div>

                    )}


                {/* =================================================
                    DOCUMENT TABLE
                ================================================= */}

                {!loading &&
                    filteredDocuments.length > 0 && (

                        <div className="documents-table-wrapper">

                            <table className="documents-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Document
                                        </th>

                                        <th>
                                            Type
                                        </th>

                                        <th>
                                            Characters
                                        </th>

                                        <th>
                                            Uploaded
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredDocuments.map(
                                        (document) => (

                                            <tr
                                                key={
                                                    document.id
                                                }
                                            >

                                                <td>

                                                    <div className="document-name-cell">

                                                        <div className="document-type-icon">
                                                            {
                                                                getFileIcon(
                                                                    document
                                                                )
                                                            }
                                                        </div>


                                                        <div>

                                                            <strong
                                                                title={
                                                                    document.fileName
                                                                }
                                                            >
                                                                {
                                                                    document.fileName
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    document.contentType ||
                                                                    "Unknown file type"
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td>

                                                    <span className="document-type-badge">

                                                        {
                                                            getFileType(
                                                                document
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="document-table-muted">

                                                        {
                                                            formatCharacters(
                                                                document.totalCharacters
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="document-table-muted">

                                                        {
                                                            formatDate(
                                                                document.uploadedAt
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                <td>

                                                    <button
                                                        className="document-open-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/documents/${document.id}`
                                                            )
                                                        }
                                                    >
                                                        Open →
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

            </section>

        </div>

    );

};


export default Documents;