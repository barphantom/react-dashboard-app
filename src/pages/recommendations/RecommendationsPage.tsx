import React, { useState } from "react";
import { Box, Button, TextField, Typography, useTheme, Grid, Card, CardContent, CircularProgress, Alert, Slider } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { tokens } from "../../themes.tsx";
import api from "../../api/axiosConfig.ts";
import Header from "../../components/Header.tsx";

const SECTORS = [
    "Basic Materials",
    "Communication Services",
    "Consumer Cyclical",
    "Consumer Defensive",
    "Energy",
    "Financial Services",
    "Healthcare",
    "Industrials",
    "Real Estate",
    "Technology",
    "Utilities",
];

interface Recommendation {
    symbol: string;
    name: string;
    sector: string;
    similarity: number;
}

interface FormValues {
    beta: number;
    pe_ratio: number;
    market_cap: number;
    dividend_yield: number;
    sectorAllocations: Record<string, number>;
}

const RecommendationsPage: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validationSchema = Yup.object({
        beta: Yup.number()
            .required("Beta is required")
            .min(0, "Beta must be at least 0")
            .max(3, "Beta cannot exceed 3"),
        pe_ratio: Yup.number()
            .required("P/E Ratio is required")
            .min(0, "P/E Ratio must be positive"),
        market_cap: Yup.number()
            .required("Market Cap is required")
            .min(0, "Market Cap must be positive"),
        dividend_yield: Yup.number()
            .required("Dividend Yield is required")
            .min(0, "Dividend Yield must be at least 0")
            .max(20, "Dividend Yield cannot exceed 20%"),
    });

    const initialValues: FormValues = {
        beta: 1.0,
        pe_ratio: 20,
        market_cap: 100000000000,
        dividend_yield: 2.0,
        sectorAllocations: {},
    };

    const handleSubmit = async (values: FormValues) => {
        // Filter out sectors with 0% allocation
        const sector_allocations = Object.entries(values.sectorAllocations)
            .filter(([_, value]) => value > 0)
            .reduce((acc, [key, value]) => {
                acc[key] = value / 100; // Convert percentage to decimal
                return acc;
            }, {} as Record<string, number>);

        // Validate that total allocation is 100%
        const totalAllocation = Object.values(values.sectorAllocations).reduce((sum, val) => sum + val, 0);

        if (Math.abs(totalAllocation - 100) > 0.01 && totalAllocation !== 0) {
            setError("Total sector allocation must equal 100%");
            return;
        }

        if (Object.keys(sector_allocations).length === 0) {
            setError("Please allocate at least one sector");
            return;
        }

        const requestData = {
            sector_allocations,
            global_params: {
                beta: values.beta,
                pe_ratio: values.pe_ratio,
                market_cap: values.market_cap,
                dividend_yield: values.dividend_yield,
            },
        };

        setLoading(true);
        setError(null);

        try {
            const response = await api.post("/recommendations/", requestData);
            setRecommendations(response.data.recommendations);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to fetch recommendations");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box m="20px">
            <Header title="Stock Recommendations" subtitle="Get personalized S&P 500 stock recommendations based on your preferences" />

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => {
                    const totalAllocation = Object.values(values.sectorAllocations).reduce((sum, val) => sum + val, 0);
                    const remaining = 100 - totalAllocation;

                    return (
                        <Form>
                            <Grid container spacing={3}>
                                {/* Global Parameters */}
                                <Grid item xs={12} md={6}>
                                    <Box
                                        sx={{
                                            backgroundColor: colors.primary[400],
                                            borderRadius: "1.5rem",
                                            p: 3,
                                        }}
                                    >
                                        <Typography variant="h5" mb={2} color={colors.greenAccent[500]}>
                                            Portfolio Parameters
                                        </Typography>

                                        <TextField
                                            fullWidth
                                            name="beta"
                                            label="Beta (volatility)"
                                            type="number"
                                            value={values.beta}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.beta && Boolean(errors.beta)}
                                            helperText={touched.beta && errors.beta}
                                            sx={{ mb: 2 }}
                                            inputProps={{ step: 0.1, min: 0, max: 3 }}
                                        />

                                        <TextField
                                            fullWidth
                                            name="pe_ratio"
                                            label="P/E Ratio"
                                            type="number"
                                            value={values.pe_ratio}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.pe_ratio && Boolean(errors.pe_ratio)}
                                            helperText={touched.pe_ratio && errors.pe_ratio}
                                            sx={{ mb: 2 }}
                                            inputProps={{ step: 1, min: 0 }}
                                        />

                                        <TextField
                                            fullWidth
                                            name="market_cap"
                                            label="Market Cap ($)"
                                            type="number"
                                            value={values.market_cap}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.market_cap && Boolean(errors.market_cap)}
                                            helperText={touched.market_cap && errors.market_cap}
                                            sx={{ mb: 2 }}
                                            inputProps={{ step: 1000000000 }}
                                        />

                                        <TextField
                                            fullWidth
                                            name="dividend_yield"
                                            label="Dividend Yield (%)"
                                            type="number"
                                            value={values.dividend_yield}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.dividend_yield && Boolean(errors.dividend_yield)}
                                            helperText={touched.dividend_yield && errors.dividend_yield}
                                            inputProps={{ step: 0.1, min: 0, max: 20 }}
                                        />
                                    </Box>
                                </Grid>

                                {/* Sector Allocations */}
                                <Grid item xs={12} md={6}>
                                    <Box
                                        sx={{
                                            backgroundColor: colors.primary[400],
                                            borderRadius: "1.5rem",
                                            p: 3,
                                            maxHeight: "500px",
                                            overflowY: "auto",
                                        }}
                                    >
                                        <Typography variant="h5" mb={1} color={colors.greenAccent[500]}>
                                            Sector Allocation
                                        </Typography>
                                        <Typography variant="body2" mb={2} color={colors.grey[300]}>
                                            Remaining: {remaining.toFixed(1)}% {remaining < 0 && <span style={{ color: colors.redAccent[500] }}>(Over 100%!)</span>}
                                        </Typography>

                                        {SECTORS.map((sector) => (
                                            <Box key={sector} mb={2}>
                                                <Typography variant="body2" color={colors.grey[100]}>
                                                    {sector}: {values.sectorAllocations[sector] || 0}%
                                                </Typography>
                                                <Slider
                                                    value={values.sectorAllocations[sector] || 0}
                                                    onChange={(_, value) => {
                                                        setFieldValue(`sectorAllocations.${sector}`, value);
                                                    }}
                                                    min={0}
                                                    max={100}
                                                    step={5}
                                                    valueLabelDisplay="auto"
                                                    sx={{
                                                        color: colors.greenAccent[500],
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>

                                {/* Submit Button */}
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading || remaining !== 0}
                                        sx={{
                                            backgroundColor: colors.greenAccent[600],
                                            color: colors.grey[100],
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            padding: "10px 20px",
                                            "&:hover": {
                                                backgroundColor: colors.greenAccent[700],
                                            },
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} /> : "Get Recommendations"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Form>
                    );
                }}
            </Formik>

            {/* Error Alert */}
            {error && (
                <Box mt={3}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <Box mt={4}>
                    <Typography variant="h4" mb={2} color={colors.grey[100]}>
                        Recommended Stocks
                    </Typography>
                    <Grid container spacing={2}>
                        {recommendations.map((rec, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card
                                    sx={{
                                        backgroundColor: colors.primary[400],
                                        borderRadius: "1rem",
                                        border: `1px solid ${colors.primary[500]}`,
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h5" color={colors.greenAccent[500]} fontWeight="bold">
                                            {rec.symbol}
                                        </Typography>
                                        <Typography variant="body1" color={colors.grey[100]} mb={1}>
                                            {rec.name}
                                        </Typography>
                                        <Typography variant="body2" color={colors.grey[300]}>
                                            Sector: {rec.sector}
                                        </Typography>
                                        <Typography variant="body2" color={colors.grey[400]} mt={1}>
                                            Match: {(rec.similarity * 100).toFixed(1)}%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default RecommendationsPage;