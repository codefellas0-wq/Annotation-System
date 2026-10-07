import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import DocumentViewer from "./pages/DocumentViewer";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import AppLayout from "./components/layout/AppLayout";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =================================================
                    PUBLIC ROUTES
                ================================================= */}

                <Route
                    element={
                        <PublicRoute />
                    }
                >

                    <Route
                        path="/login"
                        element={
                            <Login />
                        }
                    />

                    <Route
                        path="/register"
                        element={
                            <Register />
                        }
                    />

                </Route>


                {/* =================================================
                    PROTECTED APPLICATION
                ================================================= */}

                <Route
                    element={
                        <ProtectedRoute />
                    }
                >

                    <Route
                        element={
                            <AppLayout />
                        }
                    >

                        <Route
                            path="/dashboard"
                            element={
                                <Dashboard />
                            }
                        />

                        <Route
                            path="/documents"
                            element={
                                <Documents />
                            }
                        />

                        <Route
                            path="/documents/:documentId"
                            element={
                                <DocumentViewer />
                            }
                        />

                    </Route>

                </Route>


                {/* =================================================
                    ROOT
                ================================================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />


                {/* =================================================
                    UNKNOWN ROUTES
                ================================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;