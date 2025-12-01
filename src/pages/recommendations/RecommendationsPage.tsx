import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    useTheme,
    Card,
    CircularProgress,
    Alert,
    Slider,
    LinearProgress,
    Chip,
    Paper,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PieChartIcon from '@mui/icons-material/PieChart';
import { tokens } from "../../themes";
import api from "../../api/axiosConfig";
import Header from "../../components/Header";


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
        beta: Yup.number().required().min(0).max(3),
        pe_ratio: Yup.number().required().min(0),
        market_cap: Yup.number().required().min(0),
        dividend_yield: Yup.number().required().min(0).max(20),
    });

    const initialValues: FormValues = {
        beta: 1.0,
        pe_ratio: 20,
        market_cap: 50000000000,
        dividend_yield: 1.5,
        sectorAllocations: { "Technology": 50, "Financial Services": 50 },
    };

    const handleSubmit = async (values: FormValues) => {
        const totalAllocation = Object.values(values.sectorAllocations).reduce((sum, val) => sum + val, 0);

        if (Math.abs(totalAllocation - 100) > 0.01 && totalAllocation !== 0) {
            setError(`Total: ${totalAllocation.toFixed(0)}%. Must be 100%.`);
            return;
        }

        const sector_allocations = Object.entries(values.sectorAllocations)
            .filter(([_, value]) => value > 0)
            .reduce((acc, [key, value]) => {
                acc[key] = value / 100;
                return acc;
            }, {} as Record<string, number>);

        if (Object.keys(sector_allocations).length === 0) {
            setError("Select at least one sector");
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
            setError("Failed to fetch recommendations");
        } finally {
            setLoading(false);
        }
    };

    const getColorForMatch = (score: number) => {
        if (score >= 0.9) return colors.greenAccent[500];
        if (score >= 0.75) return colors.blueAccent[500];
        return colors.redAccent[500];
    };

    return (
        <Box m="20px" sx={{ height: "78vh", display: "flex", flexDirection: "column" }}>
            <Header title="AI Recommendations" subtitle="Find stocks matching your precise criteria" />

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, errors, touched, handleChange, handleBlur, setFieldValue, submitForm }) => {

                    const totalAllocation = Object.values(values.sectorAllocations).reduce((sum, val) => sum + val, 0);
                    const isAllocationValid = Math.abs(totalAllocation - 100) < 0.1;

                    return (
                        <Form style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", gap: "16px" }}>
                            <Paper sx={{ p: 2, backgroundColor: colors.primary[400], borderRadius: "12px", flexShrink: 0 }}>
                                <Box display="flex" alignItems="center" gap={1} mb={2}>
                                    <TrendingUpIcon sx={{ color: colors.greenAccent[500], fontSize: 20 }} />
                                    <Typography variant="h6" fontWeight="600" color={colors.grey[100]} fontSize="14px">
                                        Global Strategy
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                                    gap: "20px"
                                }}>
                                    <TextField
                                        fullWidth variant="filled" label="Beta" name="beta" type="number" size="small"
                                        value={values.beta} onChange={handleChange} onBlur={handleBlur}
                                        error={touched.beta && !!errors.beta}
                                        inputProps={{ step: 0.1, min: 0 }}
                                    />
                                    <TextField
                                        fullWidth variant="filled" label="P/E Ratio" name="pe_ratio" type="number" size="small"
                                        value={values.pe_ratio} onChange={handleChange} onBlur={handleBlur}
                                        error={touched.pe_ratio && !!errors.pe_ratio}
                                    />
                                    <TextField
                                        fullWidth variant="filled" label="Div Yield %" name="dividend_yield" type="number" size="small"
                                        value={values.dividend_yield} onChange={handleChange} onBlur={handleBlur}
                                        error={touched.dividend_yield && !!errors.dividend_yield}
                                        inputProps={{ step: 0.1, min: 0 }}
                                    />
                                    <TextField
                                        fullWidth variant="filled" label="Min Cap ($)" name="market_cap" type="number" size="small"
                                        value={values.market_cap} onChange={handleChange} onBlur={handleBlur}
                                        error={touched.market_cap && !!errors.market_cap}
                                    />
                                </Box>
                            </Paper>

                            <Paper sx={{
                                p: 2,
                                backgroundColor: colors.primary[400],
                                borderRadius: "12px",
                                flexGrow: 1,
                                display: "flex",
                                flexDirection: "column",
                                minHeight: "200px"
                            }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <PieChartIcon sx={{ color: colors.blueAccent[500], fontSize: 20 }} />
                                        <Typography variant="h6" fontWeight="600" color={colors.grey[100]} fontSize="14px">
                                            Sector Allocation
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={`${totalAllocation.toFixed(0)}%`}
                                        size="small"
                                        sx={{
                                            fontWeight: "bold",
                                            backgroundColor: isAllocationValid ? "rgba(76, 206, 172, 0.2)" : "rgba(239, 83, 80, 0.2)",
                                            color: isAllocationValid ? colors.greenAccent[500] : colors.redAccent[500]
                                        }}
                                    />
                                </Box>

                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min(totalAllocation, 100)}
                                    sx={{ mb: 2, height: 4, borderRadius: 2, backgroundColor: colors.primary[500], "& .MuiLinearProgress-bar": { backgroundColor: isAllocationValid ? colors.greenAccent[500] : colors.redAccent[500] } }}
                                />

                                {/* Kontener dla suwaków - Automatyczna siatka */}
                                <Box sx={{
                                    overflowY: "auto",
                                    pr: 1,
                                    flexGrow: 1,
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                    gap: "20px 30px",
                                    alignContent: "start",
                                    "&::-webkit-scrollbar": { height: "4px" },
                                    "&::-webkit-scrollbar-thumb": { backgroundColor: colors.blueAccent[500], borderRadius: "3px" },
                                    "&::-webkit-scrollbar-track": { backgroundColor: colors.primary[400] }
                                }}>
                                    {SECTORS.map((sector) => (
                                        <Box key={sector}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="caption" color={colors.grey[100]} noWrap title={sector} sx={{fontSize: 11}}>{sector}</Typography>
                                                <Typography variant="caption" fontWeight="bold" color={colors.greenAccent[500]}>
                                                    {values.sectorAllocations[sector] || 0}%
                                                </Typography>
                                            </Box>
                                            <Slider
                                                size="small"
                                                value={values.sectorAllocations[sector] || 0}
                                                onChange={(_, val) => setFieldValue(`sectorAllocations.${sector}`, val)}
                                                step={5} min={0} max={100}
                                                sx={{ color: colors.greenAccent[500], p: 0.5 }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>

                            {/* Przycisk akcji - Pomiędzy sekcjami */}
                            <Box display="flex" justifyContent="center">
                                <Button
                                    onClick={submitForm}
                                    disabled={loading || !isAllocationValid}
                                    variant="contained"
                                    size="medium"
                                    sx={{
                                        backgroundColor: colors.blueAccent[500],
                                        color: "white",
                                        fontWeight: "bold",
                                        borderRadius: "20px",
                                        px: 4,
                                        boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                                        "&:hover": { backgroundColor: "#3693e0" }
                                    }}
                                    startIcon={loading ? <CircularProgress size={16} color="inherit"/> : <SearchIcon />}
                                >
                                    {loading ? "Searching..." : "Find Stocks"}
                                </Button>
                            </Box>

                            {error && <Alert severity="error" sx={{ py: 0 }}>{error}</Alert>}

                            {recommendations.length > 0 && (
                                <Box sx={{ flexShrink: 0, overflow: "hidden" }}>
                                    <Box sx={{
                                        display: "flex",
                                        overflowX: "auto",
                                        gap: 2,
                                        pb: 1,
                                        "&::-webkit-scrollbar": { height: "6px" },
                                        "&::-webkit-scrollbar-thumb": { backgroundColor: colors.blueAccent[500], borderRadius: "3px" },
                                        "&::-webkit-scrollbar-track": { backgroundColor: colors.primary[400] }
                                    }}>
                                        {recommendations.map((rec, index) => (
                                            <Card
                                                key={index}
                                                sx={{
                                                    width: "130px",  // Sztywne wymiary kwadratu
                                                    height: "130px", // Sztywne wymiary kwadratu
                                                    backgroundColor: colors.primary[400],
                                                    borderRadius: "16px",
                                                    border: `1px solid ${colors.grey[700]}`,
                                                    flexShrink: 0,
                                                    display: "flex", // Flex dla centrowania
                                                    flexDirection: "column",
                                                    alignItems: "center", // Centrowanie poziome
                                                    justifyContent: "center", // Centrowanie pionowe
                                                    transition: "0.2s",
                                                    cursor: "pointer",
                                                    "&:hover": { borderColor: getColorForMatch(rec.similarity), transform: "scale(1.05)" }
                                                }}
                                            >
                                                {/* Score Circle - Central Point */}
                                                <Box position="relative" display="inline-flex" mb={1}>
                                                    <CircularProgress
                                                        variant="determinate"
                                                        value={rec.similarity * 100}
                                                        size={38}
                                                        thickness={5}
                                                        sx={{ color: getColorForMatch(rec.similarity) }}
                                                    />
                                                    <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Typography variant="caption" component="div" color="text.secondary" fontWeight="bold" fontSize="10px">
                                                            {(rec.similarity * 100).toFixed(0)}%
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Typography variant="subtitle2" color={colors.grey[100]} fontWeight="bold" lineHeight={1.1}>
                                                    {rec.symbol}
                                                </Typography>

                                                <Chip
                                                    label={rec.sector}
                                                    size="small"
                                                    sx={{
                                                        mt: 0.5,
                                                        height: 16,
                                                        fontSize: 9,
                                                        maxWidth: "90%",
                                                        backgroundColor: "rgba(255,255,255,0.08)"
                                                    }}
                                                />
                                            </Card>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Form>
                    );
                }}
            </Formik>
        </Box>
    );
};

export default RecommendationsPage;