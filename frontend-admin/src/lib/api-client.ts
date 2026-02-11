import axios from 'axios';

const adminApiClient = axios.create({
    baseURL: '/api/admin',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ── Request Interceptor: Attach JWT token ──
adminApiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// ── Response Interceptor: Handle 401 / 403 ──
adminApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === 401) {
            localStorage.removeItem('admin_access_token');
            window.location.href = '/login';
        }
        if (status === 403) {
            console.error('Access denied: Admin privileges required');
        }
        return Promise.reject(error);
    },
);

export default adminApiClient;
