import { useEffect, useState} from "react";
import {getUserProfile} from "../../api/portfolioApi.tsx";
import {UserContext} from "./UserContext.tsx";
import {Outlet} from "react-router-dom";

interface UserProfile {
    name: string;
    lastName: string;
    email: string;
}

export const UserProvider = () => {
    const [user, setUser] = useState<UserProfile>({
        name: "",
        lastName: "",
        email: "",
    });
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            const userData = await getUserProfile();
            setUser({
                name: userData.name || "",
                lastName: userData.lastName || "",
                email: userData.email || "",
            });
        } catch (error) {
            console.error("Failed to fetch user for context", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, [])

    const updateLocalUser = (data: Partial<UserProfile>) => {
        setUser(prev => ({...prev, ...data}));
    }

    return (
        <UserContext.Provider value={{ user, loading, refreshUser: fetchUserData, updateLocalUser }}>
            <Outlet />
        </UserContext.Provider>
    )
}