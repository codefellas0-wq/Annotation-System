import api from "../api/axios";

export const loginUser = async (email, password) => {
    const response = await api.post(
        "/api/auth/login",
        {
            email,
            password
        }
    );

    const token = response.data.data.token;

    localStorage.setItem("token", token);

    return response.data;
};

export const logoutUser = () => {
    localStorage.removeItem("token");
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};