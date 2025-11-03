import {useContext} from "react";
import {PortfolioContext} from "./PortfolioContext.tsx"

export const usePortfolio = () => {
    const ctx = useContext(PortfolioContext);
    if (!ctx) {
        throw new Error("usePortfolio must be used inside PortfolioProvider");
    }
    return ctx;
};
