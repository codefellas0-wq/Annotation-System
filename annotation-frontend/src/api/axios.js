import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

api.interceptors.request.use(
    (config) => {

        const isAuthRequest =
            config.url?.startsWith("/api/auth/");

        if (!isAuthRequest) {

            const token =
                localStorage.getItem("token");

            if (token) {

                config.headers.Authorization =
                    `Bearer ${token}`;

            }
        }

        /*
         * IMPORTANT:
         *
         * Do NOT manually set Content-Type here.
         *
         * Axios/browser must create the correct
         * multipart boundary when FormData is used.
         */

        return config;
    },

    (error) => {

        return Promise.reject(error);

    }
);

export default api;