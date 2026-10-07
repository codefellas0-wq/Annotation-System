import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");

        navigate("/login", {
            replace: true
        });
    };

    const getLinkClass = ({ isActive }) =>
        isActive
            ? "app-nav-link active"
            : "app-nav-link";

    const isDocumentViewer =
        location.pathname.startsWith("/documents/");

    return (
        <header className="app-navbar">

            <div className="app-navbar-inner">

                {/* Brand */}
                <button
                    type="button"
                    className="app-brand"
                    onClick={() => navigate("/dashboard")}
                >
                    <span className="app-brand-mark">
                        A
                    </span>

                    <span className="app-brand-text">
                        <strong>
                            Annotation
                        </strong>

                        <small>
                            Workspace
                        </small>
                    </span>
                </button>


                {/* Navigation */}
                <nav
                    className="app-navigation"
                    aria-label="Main navigation"
                >

                    <NavLink
                        to="/dashboard"
                        className={getLinkClass}
                    >
                        Dashboard
                    </NavLink>


                    <NavLink
                        to="/documents"
                        className={({ isActive }) =>
                            isActive || isDocumentViewer
                                ? "app-nav-link active"
                                : "app-nav-link"
                        }
                    >
                        Documents
                    </NavLink>

                </nav>


                {/* Account */}
                <div className="app-navbar-actions">

                    <div className="app-user">
                        <div className="app-user-avatar">
                            U
                        </div>

                        <div className="app-user-info">
                            <strong>
                                User
                            </strong>

                            <span>
                                Workspace
                            </span>
                        </div>
                    </div>


                    <button
                        type="button"
                        className="app-logout-button"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <span>
                            ↪
                        </span>

                        <span className="app-logout-text">
                            Logout
                        </span>
                    </button>

                </div>

            </div>

        </header>
    );
};

export default Navbar