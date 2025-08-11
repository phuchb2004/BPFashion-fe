import axios from "axios";

const axiosSystem = axios.create({
    baseURL: 'https://localhost:7134/Users',
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosSystem.interceptors.request.use(
    (config) => {
        config.headers = config.headers || {};
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosSystem.interceptors.response.use(
    (response) => {
        return Promise.resolve(response.data);
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/pages/login';
        }
        return Promise.reject(error);
    }
);

export default axiosSystem;