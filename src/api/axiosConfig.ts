import axios from 'axios';
import {jwtDecode} from "jwt-decode";

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
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


// api.interceptors.request.use((config) => {
//     const accessToken = localStorage.getItem("access")
//
//     if (
//         accessToken &&
//         !config.url?.includes("login/") &&
//         !config.url?.includes("register/") &&
//         !config.url?.includes("token/refresh/") &&
//         !config.url?.includes("token/verify/")
//     ) {
//         config.headers.Authorization = `Bearer ${accessToken}`
//     }
//     return config;
// })

// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;
//
//         if (
//             error.response?.status === 401 &&
//             !originalRequest._retry &&
//             !originalRequest.url.includes("login/") &&
//             !originalRequest.url.includes("register/")
//         ) {
//             originalRequest._retry = true;
//             const refreshToken = localStorage.getItem("refresh");
//
//             if (!refreshToken) {
//                 localStorage.clear()
//                 window.location.href = "/login";
//                 return Promise.reject(error);
//             }
//
//             try {
//                 const response = await api.post("auth/token/refresh/", {"refresh": refreshToken})
//
//                 const newAccess = response.data.access;
//                 const newRefresh = response.data.refresh;
//                 localStorage.setItem("access", newAccess);
//                 localStorage.setItem("refresh", newRefresh);
//
//                 originalRequest.headers.Authorization = `Bearer ${newAccess}`;
//                 return api(originalRequest);
//
//             } catch (refreshError) {
//                 console.error("❌ Refresh token expired — logout");
//                 localStorage.clear()
//                 window.location.href = "/login";
//                 return Promise.reject(refreshError);
//             }
//         }
//
//         return Promise.reject(error);
//     }
// );

export default api;