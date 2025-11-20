import {Box, CircularProgress, Divider, Typography, useTheme} from "@mui/material";
import {tokens} from "../../themes.tsx";
import {useEffect, useState} from "react";
import type {PortfolioStock} from "../../types/stockTypes.tsx";
import {getPortfolioStocks} from "../../api/portfolioApi.tsx";

type PortfolioAssetsListProps = {
    portfolioId: number;
}

const PortfolioAssetsList = ({ portfolioId }: PortfolioAssetsListProps) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [stocks, setStocks] = useState<PortfolioStock[]>([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStocks = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getPortfolioStocks(portfolioId);
                setStocks(data);
            } catch (err: any) {
                setError(err.message || "Error fetching portfolio stocks");
            } finally {
                setLoading(false);
            }
        };

        fetchStocks();
    }, [portfolioId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error.main" align="center">
                {error}
            </Typography>
        );
    }

    if (stocks.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%" pb="20px">
                <Typography align="center" color={colors.grey[400]}>
                    No assets in portfolio
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                p: 1,
                "&::-webkit-scrollbar": {
                    width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: colors.grey[600],
                    borderRadius: "4px",
                },
            }}
        >
            {stocks.map((stock, index) => (
                <Box key={stock.id}>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p="0.5rem 0.75rem"
                        sx={{
                            borderRadius: "0.5rem",
                            "&:hover": {
                                backgroundColor: colors.primary[500],
                            },
                            transition: "background 0.2s",
                        }}
                    >
                        {/*Lewa strona*/}
                        <Box display="flex" flexDirection="column">
                            <Typography variant="h5" fontWeight="bold" color={colors.greenAccent[400]}>
                                {stock.symbol}
                            </Typography>
                            <Typography variant="body2" color={colors.grey[300]}>
                                {stock.name}
                            </Typography>
                        </Box>

                        {/*Prawa strona*/}
                        <Box textAlign="right">
                            <Typography variant="body2" color={colors.grey[200]}>
                                {Number(stock.quantity).toFixed(2)} × {Number(stock.purchase_price).toFixed(2)} USD
                            </Typography>
                            <Typography variant="caption" color={colors.grey[400]}>
                                {new Date(stock.purchase_date).toLocaleDateString()}
                            </Typography>
                        </Box>
                    </Box>
                    {index < stocks.length - 1 && <Divider sx={{ backgroundColor: colors.primary[600] }} />}
                </Box>
            ))}
        </Box>
    )
}

export default PortfolioAssetsList;