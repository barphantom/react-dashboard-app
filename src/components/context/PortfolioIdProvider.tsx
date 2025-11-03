import {useEffect, useState} from "react";
import api from "../../api/axiosConfig.ts";
import {PortfolioContext} from "./PortfolioContext.tsx";
import {Outlet} from "react-router-dom";

// interface PortfolioIdProviderProps {
//     children: React.ReactNode;
// }

export const PortfolioIdProvider = () => {
    const [portfolioId, setPortfolioId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPortfolioId = async () => {
            try {
                const response = await api.get("/portfolio/active/");
                setPortfolioId(response.data.id);
            } catch (err) {
                console.error("Error fetching portfolio id", err);
                setError("Failed to load portfolio");
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolioId();
    }, []);

    return (
        <PortfolioContext.Provider value={{ portfolioId, loading, error }}>
            <Outlet />
        </PortfolioContext.Provider>
    )
}