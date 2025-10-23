import api from "../api/axiosConfig.ts"
import type {StockSearchResult} from "../types/stockTypes.tsx";

interface PortfolioHistoryPoint {
    x: string
    y: string
}

export interface PortfolioHistoryData {
    id: string
    data: PortfolioHistoryPoint[]
}

export interface PortfolioStats {
    total_value: number,
    profit_value: number,
    profit_percent: number,
    weekly_change_percent: number,
}

export const getPortfolioStats = async (portfolioId: number): Promise<PortfolioStats> => {
    const response = await api.get(`portfolio/${portfolioId}/stats/`);
    return response.data;
}

export const getPortfolioHistory = async (range: string): Promise<PortfolioHistoryData> => {
    const res = await fetch(`/api/portfolio/history?range=${range}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch portfolio history for ${range}`);
    }
    return res.json();
}

export const searchStocks = async (query: string): Promise<StockSearchResult[]> => {
    if (!query) return [];

    try {
        const response = await api.get("search/", {
            params: {query}
        })
        return response.data;
    } catch (error) {
        console.error("Error fetching stock search results:", error);
        return [];
    }
}

export const getPortfolioChartData = async (portfolioId: number) => {
    const response = await api.get(`portfolio/${portfolioId}/chart/`)
    return response.data;
}
