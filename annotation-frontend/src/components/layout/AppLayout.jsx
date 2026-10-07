import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import Breadcrumbs from "./Breadcrumbs";

import "./AppLayout.css";

const AppLayout = () => {

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const handleOpenSidebar = () => {
        setSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };

    return (

        <div className="app-layout">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Sidebar
                isOpen={sidebarOpen}
                onClose={handleCloseSidebar}
            />


            {/* =================================================
                MAIN AREA
            ================================================= */}

            <div className="app-main">

                <TopNavbar
                    onMenuClick={handleOpenSidebar}
                />


                <main className="app-content">

                    <Breadcrumbs />

                    <div className="app-page-content">

                        <Outlet />

                    </div>

                </main>

            </div>

        </div>
    );
};

export default AppLayout;