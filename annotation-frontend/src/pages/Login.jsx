import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthHeader from "../components/auth/AuthHeader";
import { loginUser } from "../auth/authService";

import "./Auth.css";


const Login = () => {

    const navigate = useNavigate();


    // =========================================================
    // FORM STATE
    // =========================================================

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");


    // =========================================================
    // UI STATE
    // =========================================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            await loginUser(
                email.trim(),
                password
            );

            console.log(
                "Login successful"
            );

            navigate(
                "/dashboard",
                {
                    replace: true
                }
            );

        } catch (error) {

            console.error(
                "Login failed:",
                error.response?.data ||
                error
            );

            setError(
                error.response?.data?.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
      
    <div className="auth-page-wrapper">

        <AuthHeader />

        <main className="auth-page">

            <section className="auth-card">

                {/* existing login content */}

            

        <div className="auth-page">

            <section
                className="auth-card"
                aria-labelledby="login-title"
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="auth-heading">

                    <span className="auth-eyebrow">
                        WELCOME BACK
                    </span>

                    <h1 id="login-title">
                        Sign in to AnnotationHub
                    </h1>

                    <p>
                        Continue working with your
                        documents and annotations.
                    </p>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    {/* Email */}

                    <div className="auth-field">

                        <label htmlFor="login-email">
                            Email
                        </label>

                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* Password */}

                    <div className="auth-field">

                        <label htmlFor="login-password">
                            Password
                        </label>

                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* Error */}

                    {error && (

                        <div
                            className="auth-error"
                            role="alert"
                        >
                            {error}
                        </div>

                    )}


                    {/* Submit */}

                    <button
                        className="auth-submit"
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Sign in"}

                    </button>

                </form>


                {/* =================================================
                    REGISTER LINK
                ================================================= */}

                <div className="auth-switch">

                    <span>
                        Don't have an account?
                    </span>

                    <Link to="/register">
                        Create one
                    </Link>

                </div>

            </section>

        </div>
        </section>

        </main>

    </div>
    );
};


export default Login;