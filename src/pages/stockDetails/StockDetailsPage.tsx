import React, {useEffect, useState, useRef} from "react";
import { useParams } from "react-router-dom";
import { Box, Button, TextField, Typography, useTheme, CircularProgress } from "@mui/material";
import {tokens} from "../../themes.tsx";
import StockChartSection from "../../components/StockChartSection.tsx";
import type {Candle} from "../../types/stockTypes.tsx";
import {getOHLCVData} from "../../api/portfolioApi.tsx";
import api from "../../api/axiosConfig.ts";
import {usePortfolio} from "../../components/context/usePortfolio.tsx";


const StockDetailsPage: React.FC = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [purchasePrice, setPurchasePrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [adding, setAdding] = useState(false);
    const [chartData, setChartData] = useState<Candle[]>([]);
    const [loadingData, setLoadingData] = useState(true)

    const { portfolioId, loading: loadingPortfolio } = usePortfolio()
    const dateInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!symbol) return;

        const fetchData = async () => {
            try {
                const data = await getOHLCVData(symbol);
                setChartData(data);
            } catch (err) {
                console.error("Błąd pobierania danych OHLCV:", err);
            } finally {
                setLoadingData(false)
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

    const handleDateFieldClick = () => {
        if (dateInputRef.current) {
            dateInputRef.current.showPicker();
        }
    };

    const handleChartClick = (candle: Candle) => {
        setPurchasePrice(candle.close.toFixed(2));

        // const date = new Date(candle.time);
        // const formattedDate = date.toISOString().split('T')[0];
        // setPurchaseDate(formattedDate);
        setPurchaseDate(candle.time)
    };

    const textFieldStyles = {
        input: { color: colors.grey[100] },
        label: { color: colors.grey[300] },
        flex: 1,
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: colors.grey[700],
            },
            '&:hover fieldset': {
                borderColor: colors.grey[500],
            },
            '&.Mui-focused fieldset': {
                borderColor: colors.greenAccent[500],
                borderWidth: '2px',
            },
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: colors.greenAccent[500],
        },
    };

    if (loadingData || loadingPortfolio) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%" >
                <CircularProgress />
                <Typography ml={2}>Loading stock data...</Typography>
            </Box>
        )
    }

    if (!portfolioId) {
        return (
            <Box m="20px">
                <Typography color="error" align="center">
                    No portfolio found for this user.
                </Typography>
            </Box>
        );
    }

    return (
        <Box m={2}>
            <Typography variant="h4" mb={2}>
                {symbol} – Szczegóły spółki
            </Typography>

            <Typography variant="body2" color={colors.grey[400]} mb={1}>
                💡 Kliknij na wykres aby automatycznie uzupełnić cenę i datę
            </Typography>

            {/* Wykres z przyciskami zakresu */}
            <StockChartSection
                data={chartData}
                onChartClick={handleChartClick}
            />

            {/* Formularz dodawania */}
            <Box display="flex" flexDirection="column" gap={2} mt={3} alignItems="center" width="100%">
                <Box display="flex" gap={1} width="75%">
                    <TextField
                        label="Cena zakupu"
                        variant="outlined"
                        size="small"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(e.target.value)}
                        sx={textFieldStyles}
                    />
                    <TextField
                        label="Ilość"
                        variant="outlined"
                        size="small"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        sx={textFieldStyles}
                    />
                    <TextField
                        label="Data zakupu"
                        type="date"
                        variant="outlined"
                        size="small"
                        value={purchaseDate}
                        onChange={(e) => setPurchaseDate(e.target.value)}
                        onClick={handleDateFieldClick}
                        inputRef={dateInputRef}
                        InputLabelProps={{ shrink: true }}
                        sx={textFieldStyles}
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