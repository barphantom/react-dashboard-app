import api from "./axiosConfig.ts"


export const login = async (email: string, password: string) => {
    const response = await api.post("auth/login/", { email, password });
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data;
};

export const register = async (name: string, lastName: string, email: string, password: string, confirmPassword: string) => {
    const response = await api.post("auth/register/", {
        name,
        lastName,
        email,
        password,
        confirm_password: confirmPassword,
    });
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data;
};

export const logout = () => {
    localStorage.clear()
    window.location.href = "/login"
}

// export async function verifyToken(): Promise<boolean> {
//     const access = localStorage.getItem("access")
//     if (!access) {
//         return false
//     }
//
//     try {
//         await api.post("auth/token/verify/", {"token": access})
//         return true
//     } catch (error) {
//         console.error("Incorrect token", error)
//         return false
//     }
// }
//
// export async function refreshToken(): Promise<boolean> {
//     const refresh = localStorage.getItem("refresh")
//     if (!refresh) {
//         return false
//     }
//
//     try {
//         const result = await api.post("auth/token/refresh/", {"refresh": refresh})
//         localStorage.setItem("access", result.data.access)
//         localStorage.setItem("refresh", result.data.refresh)
//         return true
//     } catch (error) {
//         console.error("Incorrect token", error)
//         return false
//     }
// }
//
// export async function logout() {
//     localStorage.removeItem("access")
//     localStorage.removeItem("refresh")
//     localStorage.removeItem("user")
//     window.location.href = "/login"
// }
