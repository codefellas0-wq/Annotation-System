import "./AnnotationSidebar.css";

const AnnotationSidebar = ({
    annotations,
    onAnnotationClick
}) => {

    return (
        <aside className="annotation-sidebar">

            <div className="annotation-sidebar-header">

                <div>
                    <h2>Annotations</h2>

                    <span>
                        {annotations.length}{" "}
                        {annotations.length === 1
                            ? "annotation"
                            : "annotations"}
                    </span>
                </div>

            </div>


            <div className="annotation-list">

                {annotations.length === 0 ? (

                    <div className="annotation-empty">

                        <p>
                            No annotations yet.
                        </p>

                        <span>
                            Select text in the document
                            to add your first annotation.
                        </span>

                    </div>

                ) : (

                    annotations.map((annotation) => (

                        <div
                            key={annotation.id}
                            className="annotation-card"
                            onClick={() =>
                                onAnnotationClick?.(
                                    annotation
                                )
                            }
                        >

                            <div className="annotation-card-top">

                                <span
                                    className="annotation-color"
                                    style={{
                                        backgroundColor:
                                            getColor(
                                                annotation.color
                                            )
                                    }}
                                />

                                <span className="annotation-page">
                                    Page {annotation.page}
                                </span>

                                {annotation.resolved && (
                                    <span className="annotation-resolved">
                                        Resolved
                                    </span>
                                )}

                            </div>


                            <div className="annotation-selected-text">

                                "{annotation.selectedText}"

                            </div>


                            {annotation.comment && (

                                <p className="annotation-comment">

                                    {annotation.comment}

                                </p>

                            )}


                            <div className="annotation-card-footer">

                                <span>
                                    {annotation.authorId
                                        ? `User ${annotation.authorId}`
                                        : "Unknown author"}
                                </span>


                                {annotation.createdAt && (

                                    <span>
                                        {formatDate(
                                            annotation.createdAt
                                        )}
                                    </span>

                                )}

                            </div>

                        </div>

                    ))

                )}

            </div>

        </aside>
    );
};


const getColor = (color) => {

    switch (color?.toLowerCase()) {

        case "yellow":
            return "#facc15";

        case "blue":
            return "#3b82f6";

        case "green":
            return "#22c55e";

        default:
            return "#facc15";
    }
};


const formatDate = (date) => {

    try {

        return new Date(date).toLocaleString();

    } catch {

        return "";

    }
};


export default AnnotationSidebar;