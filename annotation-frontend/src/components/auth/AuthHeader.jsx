import { useNavigate } from "react-router-dom";

import "./AuthHeader.css";

const AuthHeader = () => {

    const navigate = useNavigate();

    return (
        <header className="auth-header">

            <div className="auth-header-inner">

                <button
                    type="button"
                    className="auth-brand"
                    onClick={() => navigate("/register")}
                    aria-label="Go to AnnotationHub"
                >

                    <span className="auth-brand-mark">
                        A
                    </span>

                    <span className="auth-brand-content">

                        <strong>
                            AnnotationHub
                        </strong>

                        <small>
                            Document workspace
                        </small>

                    </span>

                </button>

            </div>

        </header>
    );
};

export default AuthHeader;