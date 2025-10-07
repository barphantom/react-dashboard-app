import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import {tokens} from "../../themes.tsx";
import StockChartSection from "../../components/StockChartSection.tsx";


const StockDetailsPage: React.FC = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [purchasePrice, setPurchasePrice] = useState("");
    const [adding, setAdding] = useState(false);

    const handleAddToPortfolio = async () => {
        if (!purchasePrice) return alert("Podaj cenę zakupu!");
        setAdding(true);
        try {
            // 🔹 tu POST do backendu
            // await fetch(`/api/portfolio/add`, {...})
            console.log(`Dodano ${symbol} po cenie ${purchasePrice}`);
            alert(`Dodano ${symbol} do portfela po cenie ${purchasePrice}`);
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
            <StockChartSection symbol={symbol ?? "AAPL"} />

            {/* Formularz dodawania */}
            <Box display="flex" alignItems="center" gap={2} mt={3}>
                <TextField
                    label="Cena zakupu"
                    variant="outlined"
                    size="small"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    sx={{
                        input: { color: colors.grey[100] },
                        label: { color: colors.grey[300] },
                    }}
                />
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleAddToPortfolio}
                    disabled={adding}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                >
                    {adding ? "Dodawanie..." : "Dodaj do portfela"}
                </Button>
            </Box>
        </Box>
    );
};

export default StockDetailsPage;
