import {jwtDecode} from "jwt-decode";

interface JwtPayload {
    exp: number;
}

export const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch {
        return false;
    }
};