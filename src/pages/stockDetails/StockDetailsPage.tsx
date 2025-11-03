import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import {tokens} from "../../themes.tsx";
import StockChartSection from "../../components/StockChartSection.tsx";
import type {Candle} from "../../types/stockTypes.tsx";
import {getOHLCVData} from "../../api/portfolioApi.tsx";
import api from "../../api/axiosConfig.ts";


const StockDetailsPage: React.FC = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [purchasePrice, setPurchasePrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [adding, setAdding] = useState(false);
    const [chartData, setChartData] = useState<Candle[]>([]);

    const portfolioId = 3

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getOHLCVData(symbol);
                setChartData(data);
            } catch (err) {
                console.error("Błąd pobierania danych OHLCV:", err);
            }
        };
        fetchData();
    }, [symbol]);

    const handleAddToPortfolio = async () => {
        if (!symbol || !purchasePrice || !quantity || !purchaseDate) {
            alert("All fields are required.");
            return;
        }

        setAdding(true);
        try {
             await api.post(`/portfolios/${portfolioId}/stocks/`, {
                    symbol: symbol,
                    quantity: parseFloat(quantity),
                    purchase_price: parseFloat(purchasePrice),
                    purchase_date: purchaseDate,
            });

            alert(`Dodano ${symbol} do portfela!`);
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.error || "Nie udało się dodać spółki.");
        } finally {
            setAdding(false);
        }
    };

    return (
        <Box m={2}>
            <Typography variant="h4" mb={2}>
                {symbol} – Szczegóły spółki
            </Typography>

            {/* Wykres z przyciskami zakresu */}
            <StockChartSection symbol={symbol ?? ""} data={chartData} />

            {/* Formularz dodawania */}
            <Box display="flex" flexDirection="column" gap={2} mt={3} alignItems="center" width="100%">
                <Box display="flex" gap={1} width="75%">
                    <TextField
                        label="Cena zakupu"
                        variant="outlined"
                        size="small"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(e.target.value)}
                        sx={{ input: { color: colors.grey[100] }, label: { color: colors.grey[300] }, flex: 1, }}
                    />
                    <TextField
                        label="Ilość"
                        variant="outlined"
                        size="small"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        sx={{ input: { color: colors.grey[100] }, label: { color: colors.grey[300] }, flex: 1, }}
                    />
                    <TextField
                        label="Data zakupu"
                        type="date"
                        variant="outlined"
                        size="small"
                        value={purchaseDate}
                        onChange={(e) => setPurchaseDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ input: { color: colors.grey[100] }, label: { color: colors.grey[300] }, flex: 1, }}
                    />
                </Box>

                <Button
                    variant="contained"
                    color="success"
                    onClick={handleAddToPortfolio}
                    disabled={adding}
                    sx={{ textTransform: "none", fontWeight: 600, width: "25%" }}
                >
                    {adding ? "Adding..." : "Add to the portfolio"}
                </Button>
            </Box>
        </Box>
    );
};

export default StockDetailsPage;
