import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5004",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
// http://localhost:7005/user/registers