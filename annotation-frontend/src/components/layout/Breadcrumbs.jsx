import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {

    const location =
        useLocation();

    const pathParts =
        location.pathname
            .split("/")
            .filter(Boolean);

    if (pathParts.length === 0) {
        return null;
    }

    const labels = {
        dashboard: "Dashboard",
        documents: "Documents",
        annotations: "Annotations",
        settings: "Settings"
    };

    return (
        <nav
            className="breadcrumbs"
            aria-label="Breadcrumb"
        >

            <Link to="/dashboard">
                Home
            </Link>

            {pathParts.map(
                (part, index) => {

                    const isLast =
                        index ===
                        pathParts.length - 1;

                    const path =
                        "/" +
                        pathParts
                            .slice(
                                0,
                                index + 1
                            )
                            .join("/");

                    const label =
                        labels[part] ||
                        part;

                    return (
                        <span
                            key={path}
                            className="breadcrumb-item"
                        >

                            <span>
                                /
                            </span>

                            {isLast ? (

                                <strong>
                                    {label}
                                </strong>

                            ) : (

                                <Link to={path}>
                                    {label}
                                </Link>

                            )}

                        </span>
                    );

                }
            )}

        </nav>
    );
};

export default Breadcrumbs;