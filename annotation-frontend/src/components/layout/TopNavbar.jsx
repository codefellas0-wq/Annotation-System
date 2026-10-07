const TopNavbar = ({
    onMenuClick
}) => {

    const token =
        localStorage.getItem("token");

    return (
        <header className="top-navbar">

            <button
                className="mobile-menu-button"
                onClick={onMenuClick}
                aria-label="Open navigation"
            >
                ☰
            </button>


            <div className="top-navbar-title">

                <span>
                    Workspace
                </span>

            </div>


            <div className="top-navbar-actions">

                <button
                    className="notification-button"
                    type="button"
                    aria-label="Notifications"
                >
                    🔔
                </button>


                <div className="user-menu">

                    <div className="user-avatar">
                        N
                    </div>

                    <div className="user-info">

                        <strong>
                            Naresh Patel
                        </strong>

                        <span>
                            {token
                                ? "Authenticated"
                                : "Guest"}
                        </span>

                    </div>

                    <span className="user-chevron">
                        ▾
                    </span>

                </div>

            </div>

        </header>
    );
};

export default TopNavbar;