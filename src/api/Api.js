import axios from "axios";

const commonConfig = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
};

export const api = axios.create({
    baseURL: 'http://localhost:8080/',
    ...commonConfig
});

export const setAuthorization = (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const removeAuthorization = () => {
    delete api.defaults.headers.common['Authorization'];
}
api.interceptors.request.use((config) => {
    console.log('Request Headers:', config.headers);
    return config;
}, (error) => {
    return Promise.reject(error);
});