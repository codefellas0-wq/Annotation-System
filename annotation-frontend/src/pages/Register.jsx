import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthHeader from "../components/auth/AuthHeader";
import api from "../api/axios";

import "./Auth.css";


const Register = () => {

    const navigate = useNavigate();


    // =========================================================
    // FORM STATE
    // =========================================================

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });


    // =========================================================
    // UI STATE
    // =========================================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =========================================================
    // HANDLE INPUT
    // =========================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            await api.post(
                "/api/auth/register",
                {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password
                }
            );

            setSuccess(
                "Registration successful. Redirecting to login..."
            );


            setTimeout(() => {

                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );

            }, 1200);

        } catch (error) {

            console.error(
                "Registration failed:",
                error.response?.data ||
                error
            );

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
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
                aria-labelledby="register-title"
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="auth-heading">

                    <span className="auth-eyebrow">
                        GET STARTED
                    </span>

                    <h1 id="register-title">
                        Create your account
                    </h1>

                    <p>
                        Create an account to start
                        managing and annotating
                        your documents.
                    </p>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    {/* Name */}

                    <div className="auth-field">

                        <label htmlFor="register-name">
                            Name
                        </label>

                        <input
                            id="register-name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            autoComplete="name"
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* Email */}

                    <div className="auth-field">

                        <label htmlFor="register-email">
                            Email
                        </label>

                        <input
                            id="register-email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* Password */}

                    <div className="auth-field">

                        <label htmlFor="register-password">
                            Password
                        </label>

                        <input
                            id="register-password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            autoComplete="new-password"
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


                    {/* Success */}

                    {success && (

                        <div
                            className="auth-success"
                            role="status"
                        >
                            {success}
                        </div>

                    )}


                    {/* Submit */}

                    <button
                        className="auth-submit"
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating account..."
                            : "Create account"}

                    </button>

                </form>


                {/* =================================================
                    LOGIN LINK
                ================================================= */}

                <div className="auth-switch">

                    <span>
                        Already have an account?
                    </span>

                    <Link to="/login">
                        Sign in
                    </Link>

                </div>

            </section>

        </div>

         </section>

        </main>

    </div>
        
    );
};


export default Register;