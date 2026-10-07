import { NavLink, useNavigate } from "react-router-dom";

import "./PublicNavbar.css";

const PublicNavbar = () => {

    const navigate = useNavigate();

    return (
        <header className="public-navbar">

            <div className="public-navbar-inner">

                {/* Brand */}

                <button
                    type="button"
                    className="public-brand"
                    onClick={() =>
                        navigate("/register")
                    }
                >

                    <span className="public-brand-mark">
                        A
                    </span>

                    <span className="public-brand-text">

                        <strong>
                            AnnotationHub
                        </strong>

                        <small>
                            Document workspace
                        </small>

                    </span>

                </button>


                {/* Navigation */}

                <nav
                    className="public-navigation"
                    aria-label="Authentication navigation"
                >

                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            isActive
                                ? "public-nav-link active"
                                : "public-nav-link"
                        }
                    >
                        Login
                    </NavLink>


                    <NavLink
                        to="/register"
                        className={({ isActive }) =>
                            isActive
                                ? "public-nav-link register active"
                                : "public-nav-link register"
                        }
                    >
                        Register
                    </NavLink>

                </nav>

            </div>

        </header>
    );
};

export default PublicNavbar;