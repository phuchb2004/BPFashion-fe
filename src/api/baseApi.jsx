import axios from "axios";

const baseApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5234',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

baseApi.interceptors.request.use(
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

baseApi.interceptors.response.use(
    (response) => {
        return Promise.resolve(response.data);
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default baseApi;