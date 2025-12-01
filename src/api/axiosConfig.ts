import axios from 'axios';
import {jwtDecode} from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    // baseURL: 'http://127.0.0.1:8000/api/',
    baseURL: `${API_URL}/api/`,
    headers: {
        'Content-Type': 'application/json',
    }
})

interface JwtPayload {
    exp: number
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
    refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = []
}

api.interceptors.request.use(async (config) => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    if (access) {
        try {
            const decoded = jwtDecode<JwtPayload>(access)
            const currentTime = Date.now() / 1000

            if (decoded.exp < currentTime && refresh) {
                if (!isRefreshing) {
                    isRefreshing = true
                    try {
                        const response = await api.post("auth/token/refresh/", {"refresh": refresh})
                        const newAccess = response.data.access
                        const newRefresh = response.data.refresh

                        localStorage.setItem("access", newAccess)
                        localStorage.setItem("refresh", newRefresh)
                        isRefreshing = false
                        onRefreshed(newAccess)
                    } catch (error) {
                        console.error("Refresh token invalid. Logging out.");
                        localStorage.clear();
                        window.location.href = "/login";
                        throw error;
                    }
                }

                return new Promise((resolve) => {
                    subscribeTokenRefresh((token) => {
                        if (config.headers) {
                            config.headers.Authorization = `Bearer ${token}`
                        }
                        resolve(config)
                    })
                })
            }

            if (config.headers) {
                config.headers.Authorization = `Bearer ${access}`
            }
        } catch (e) {
            console.error("Invalid token", e)
            localStorage.clear()
            window.location.href = "/login"
        }
    }

    return config
})

export default api;