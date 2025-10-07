import type {StockSearchResult} from "../types/stockTypes.tsx";

interface PortfolioHistoryPoint {
    x: string
    y: string
}

export interface PortfolioHistoryData {
    id: string
    data: PortfolioHistoryPoint[]
}

export const getPortfolioHistory = async (range: string): Promise<PortfolioHistoryData> => {
    const res = await fetch(`/api/portfolio/history?range=${range}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch portfolio history for ${range}`);
    }
    return res.json();
}

export const searchStocks = async (query: string): Promise<StockSearchResult[]> => {
    // const res = await fetch(`/api/stocks/search?query=${query}`);
    // if (!res.ok) {
    //     throw new Error(`Failed to fetch stock search results for ${query}`);
    // }
    // return res.json();

    if (!query) return [];

    // Symulacja oczekiwania na backend (dla UX realizmu)
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Mockowane dane — możesz potem rozbudować o więcej pól
    const dummyStocks: StockSearchResult[] = [
        { symbol: "AAPL", name: "Apple Inc." },
        { symbol: "AAPL", name: "Allllllpple Inc." },
        { symbol: "MSFT", name: "Microsoft Corporation" },
        { symbol: "GOOGL", name: "Alphabet Inc." },
        { symbol: "TSLA", name: "Tesla, Inc." },
        { symbol: "NVDA", name: "NVIDIA Corporation" },
        { symbol: "AMZN", name: "Amazon.com, Inc." },
    ];

    // Filtrowanie po wpisanym query (proste wyszukiwanie)
    return dummyStocks.filter((stock) =>
        stock.name.toLowerCase().includes(query.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(query.toLowerCase())
    );
}
