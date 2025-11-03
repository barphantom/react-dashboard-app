import {createContext} from 'react';

interface PortfolioContextType {
    portfolioId: number | null;
    loading: boolean;
    error: string | null;
}

export const PortfolioContext = createContext<PortfolioContextType | null>(null)
