import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Django URL
    headers: {
        'Content-Type': 'application/json',
    }
});

// Automatically add the token to every request if it exists
api.interceptors.request.use((config) => {
    // list of public endpoints that don't require token authentication
    const publicEndpoints = [
        'auth/login/', 
        'auth/register/', 
        'auth/token/refresh/'
    ];

    // Check if the current request URL matches any public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint => config.url.includes(endpoint));

    const token = localStorage.getItem('access_token');

    // If we have a token and it's NOT a public route, attach the header
    if (token && !isPublicEndpoint) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

export default api;