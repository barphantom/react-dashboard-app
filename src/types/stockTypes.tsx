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

export interface PortfolioDataPoint {
    time: string;
    value: number;
}

export type PortfolioChartNewProps = {
    portfolioId: number
}

export type PortfolioChartProps = {
    data: NivoSeries[]
}

export interface NivoDataPoint {
    x: string;  // data w formacie "YYYY-MM-DD"
    y: number;  // wartość portfela
}

export interface NivoSeries {
    id: string;        // nazwa serii, np. "Portfolio"
    data: NivoDataPoint[];
}

export interface PortfolioStock {
    id: number;
    symbol: string;
    name: string;
    quantity: number;
    purchase_price: number;
    purchase_date: string; // YYYY-MM-DD
}

export interface PortfolioCompositionResponse {
    data: NivoPieItem[];
    warnings?: string[];
    error?: string | null;
}

export interface NivoPieItem {
    id: string;
    label: string;
    value: number;
    percentage?: number;
}
