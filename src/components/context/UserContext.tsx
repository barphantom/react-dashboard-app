import { createContext } from "react";

interface UserProfile {
    name: string;
    lastName: string;
    email: string;
}

interface UserContextType {
    user: UserProfile;
    loading: boolean;
    refreshUser: () => Promise<void>; // Funkcja do wymuszenia odświeżenia z API
    updateLocalUser: (data: Partial<UserProfile>) => void; // Funkcja do szybkiej aktualizacji bez API
}

export const UserContext = createContext<UserContextType | undefined>(undefined)



