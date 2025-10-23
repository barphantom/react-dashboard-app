export interface StockSearchResult {
    symbol: string;
    name: string;
}

export interface StockDetails {
    symbol: string;
    name: string;
    currentPrice: number;
    changePercent: number;
    description?: string;
}

export interface Candle {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface StockChartSectionProps {
    symbol: string;
}

export interface PortfolioDataPoint {
    time: string;
    value: number;
}

export type PortfolioChartNewProps = {
    portfolioId: number
}