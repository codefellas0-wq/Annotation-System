import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {

    const navigationItems = [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: "⌂"
        },
        {
            label: "Documents",
            path: "/documents",
            icon: "▣"
        },
        {
            label: "Annotations",
            path: "/annotations",
            icon: "✎"
        }
    ];

    const secondaryItems = [
        {
            label: "Settings",
            path: "/settings",
            icon: "⚙"
        }
    ];

    const handleLogout = () => {

        localStorage.removeItem("token");

        window.location.href = "/login";
    };

    return (
        <>
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                />
            )}

            <aside
                className={
                    isOpen
                        ? "app-sidebar open"
                        : "app-sidebar"
                }
            >

                <div className="sidebar-brand">

                    <div className="brand-mark">
                        A
                    </div>

                    <div className="brand-content">

                        <strong>
                            AnnotationHub
                        </strong>

                        <span>
                            Document workspace
                        </span>

                    </div>

                    <button
                        className="sidebar-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                <nav className="sidebar-navigation">

                    <p className="sidebar-section-title">
                        Workspace
                    </p>

                    {navigationItems.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar-link active"
                                    : "sidebar-link"
                            }
                        >

                            <span className="sidebar-icon">
                                {item.icon}
                            </span>

                            <span>
                                {item.label}
                            </span>

                        </NavLink>

                    ))}


                    <p className="sidebar-section-title">
                        Account
                    </p>

                    {secondaryItems.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar-link active"
                                    : "sidebar-link"
                            }
                        >

                            <span className="sidebar-icon">
                                {item.icon}
                            </span>

                            <span>
                                {item.label}
                            </span>

                        </NavLink>

                    ))}

                </nav>


                <div className="sidebar-bottom">

                    <button
                        className="sidebar-logout"
                        onClick={handleLogout}
                    >

                        <span className="sidebar-icon">
                            ⇥
                        </span>

                        <span>
                            Logout
                        </span>

                    </button>

                </div>

            </aside>
        </>
    );
};

export default Sidebar;