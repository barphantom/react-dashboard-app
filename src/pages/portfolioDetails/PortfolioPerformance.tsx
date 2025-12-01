import React from "react";
import {
    Box,
    Typography,
    useTheme,
} from "@mui/material";

import { tokens } from "../../themes";
import Header from "../../components/Header";
import { usePortfolio } from "../../components/context/usePortfolio.tsx";
import PortfolioValueChart from "../../components/PortfolioDashboard/PortfolioValueChart.tsx";

const PortfolioPerformance: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { portfolioId } = usePortfolio();

    if (!portfolioId) {
        return (
            <Box m="20px">
                <Typography color="error">Error selecting portfolio.</Typography>
            </Box>
        );
    }

    return (
        <Box m="20px">
            <Header title="Portfolio Performance" subtitle="Deep dive into your assets and value history" />
            <Box
                sx={{
                    backgroundColor: colors.primary[400],
                    borderRadius: "12px",
                    p: "20px",
                    height: "60vh", // Duża wysokość dla wykresu
                    minHeight: "500px",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb={2}>
                    Value History
                </Typography>

                <Box flex={1} width="100%">
                    <PortfolioValueChart portfolioId={portfolioId} />
                </Box>
            </Box>
        </Box>
    );
};

export default PortfolioPerformance;
