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
    IconButton,
    MenuItem,
    Divider,
    Grid
} from "@mui/material";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import PieChartIcon from '@mui/icons-material/PieChart';
import ShowChartIcon from '@mui/icons-material/ShowChart'; // Dla convergence (opcjonalnie)
import { tokens } from "../../themes";
import api from "../../api/axiosConfig";
import Header from "../../components/Header";

// --- TYPY DANYCH Z BACKENDU ---

interface StockData {
    symbol: string;
    name: string;
    sector: string;
    values: {
        beta: number;
        pe: number;
        div: number;
    };
    match_score: {
        risk_score: number;
        goal_score: number;
        size_score: number;
    };
}

interface SegmentResult {
    segment_index: number;
    segment_params: SegmentFormValues;
    assigned_stocks: StockData[];
}

interface GAResponse {
    structured_portfolio: SegmentResult[];
    total_fitness: number;
    stats: any;
    convergence: number[];
}

// --- TYPY FORMULARZA ---

interface SegmentFormValues {
    ratio: number; // 0-100 dla UI, konwertowane na 0.0-1.0 dla API
    risk: number; // 1-5
    investment_goal: "growth" | "income" | "balanced";
    time_horizon: "short" | "medium" | "long";
}

interface FormValues {
    portfolio_size: number;
    concentration: number; // 1-5
    segments: SegmentFormValues[];
}

const GARecommendationsPage: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [results, setResults] = useState<GAResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Domyślne wartości: 2 segmenty (50/50)
    const initialValues: FormValues = {
        portfolio_size: 10,
        concentration: 3,
        segments: [
            { ratio: 50, risk: 5, investment_goal: "growth", time_horizon: "long" },
            { ratio: 50, risk: 2, investment_goal: "income", time_horizon: "medium" }
        ],
    };

    const validationSchema = Yup.object().shape({
        portfolio_size: Yup.number().min(5).max(50).required(),
        segments: Yup.array().of(
            Yup.object().shape({
                ratio: Yup.number().min(1).max(100),
                risk: Yup.number().min(1).max(5),
            })
        )
    });

    const handleSubmit = async (values: FormValues) => {
        // 1. Walidacja sumy procentów
        const totalRatio = values.segments.reduce((sum, seg) => sum + seg.ratio, 0);
        if (Math.abs(totalRatio - 100) > 1) {
            setError(`Total allocation is ${totalRatio}%. Must be 100%.`);
            return;
        }

        setLoading(true);
        setError(null);
        setResults(null);

        // 2. Przygotowanie payloadu (konwersja % na ułamki)
        const payload = {
            portfolio_size: values.portfolio_size,
            concentration: values.concentration,
            segments: values.segments.map(s => ({
                ...s,
                ratio: s.ratio / 100.0
            }))
        };

        try {
            const response = await api.post("/recommendations/ga/", payload);
            setResults(response.data);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.details || "Failed to generate portfolio.");
        } finally {
            setLoading(false);
        }
    };

    // Helper do kolorowania kafelków na podstawie wyniku
    const getScoreColor = (score: number) => {
        if (score > 0.8) return colors.greenAccent[500];
        if (score > 0.6) return colors.blueAccent[500];
        return colors.redAccent[500];
    };

    return (
        <Box m="20px" pb="40px">
            <Header title="Genetic Portfolio AI" subtitle="Build a multi-strategy portfolio using evolutionary algorithms" />

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, handleChange, setFieldValue, submitForm }) => {

                    const totalAllocation = values.segments.reduce((sum, s) => sum + s.ratio, 0);
                    const isAllocationValid = Math.abs(totalAllocation - 100) <= 1;

                    return (
                        <Form>
                            <Grid container spacing={2}>
                                {/* --- LEWA KOLUMNA: KONFIGURACJA --- */}
                                <Grid item xs={12} md={4}>

                                    {/* 1. Global Settings */}
                                    <Paper sx={{ p: 2, mb: 2, backgroundColor: colors.primary[400], borderRadius: "12px" }}>
                                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                                            <SettingsSuggestIcon sx={{ color: colors.greenAccent[500] }} />
                                            <Typography variant="h6" fontWeight="bold">Global Parameters</Typography>
                                        </Box>

                                        <Box display="flex" flexDirection="column" gap={2}>
                                            <TextField
                                                fullWidth label="Portfolio Size (Stocks)" name="portfolio_size" type="number" size="small" variant="filled"
                                                value={values.portfolio_size} onChange={handleChange}
                                                inputProps={{ min: 5, max: 50 }}
                                            />

                                            <Box>
                                                <Typography variant="caption" color={colors.grey[300]}>
                                                    Global Diversification Pressure (1-5)
                                                </Typography>
                                                <Slider
                                                    value={values.concentration}
                                                    onChange={(_, val) => setFieldValue("concentration", val)}
                                                    step={1} min={1} max={5} marks
                                                    valueLabelDisplay="auto"
                                                    sx={{ color: colors.blueAccent[500] }}
                                                />
                                                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: -1 }}>
                                                    {values.concentration === 1 ? "Very Diverse" : values.concentration === 5 ? "Concentrated" : "Balanced"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>

                                    {/* 2. Segments Configuration (FieldArray) */}
                                    <Paper sx={{ p: 2, backgroundColor: colors.primary[400], borderRadius: "12px", border: isAllocationValid ? "none" : `1px solid ${colors.redAccent[500]}` }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <PieChartIcon sx={{ color: isAllocationValid ? colors.blueAccent[500] : colors.redAccent[500] }} />
                                                <Typography variant="h6" fontWeight="bold">Allocation Strategy</Typography>
                                            </Box>
                                            <Chip
                                                label={`${totalAllocation}%`}
                                                color={isAllocationValid ? "success" : "error"}
                                                variant={isAllocationValid ? "filled" : "outlined"}
                                                size="small"
                                            />
                                        </Box>

                                        <FieldArray name="segments">
                                            {({ push, remove }) => (
                                                <Box display="flex" flexDirection="column" gap={2}>
                                                    {values.segments.map((segment, index) => (
                                                        <Card key={index} sx={{ p: 2, backgroundColor: colors.primary[500], position: 'relative' }}>
                                                            {values.segments.length > 1 && (
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => remove(index)}
                                                                    sx={{ position: 'absolute', top: 5, right: 5, color: colors.grey[500] }}
                                                                >
                                                                    <DeleteOutlineIcon fontSize="small" />
                                                                </IconButton>
                                                            )}

                                                            <Typography variant="subtitle2" color={colors.blueAccent[400]} mb={1}>
                                                                Segment #{index + 1}
                                                            </Typography>

                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12}>
                                                                    <Typography variant="caption">Allocation %</Typography>
                                                                    <Slider
                                                                        value={segment.ratio}
                                                                        onChange={(_, val) => setFieldValue(`segments.${index}.ratio`, val)}
                                                                        step={5} min={0} max={100}
                                                                        sx={{ color: colors.greenAccent[400], py: 0 }}
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        select fullWidth label="Goal" size="small" variant="filled"
                                                                        value={segment.investment_goal}
                                                                        onChange={handleChange}
                                                                        name={`segments.${index}.investment_goal`}
                                                                    >
                                                                        <MenuItem value="growth">Growth</MenuItem>
                                                                        <MenuItem value="income">Income</MenuItem>
                                                                        <MenuItem value="balanced">Balanced</MenuItem>
                                                                    </TextField>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        select fullWidth label="Horizon" size="small" variant="filled"
                                                                        value={segment.time_horizon}
                                                                        onChange={handleChange}
                                                                        name={`segments.${index}.time_horizon`}
                                                                    >
                                                                        <MenuItem value="short">Short</MenuItem>
                                                                        <MenuItem value="medium">Medium</MenuItem>
                                                                        <MenuItem value="long">Long</MenuItem>
                                                                    </TextField>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <Typography variant="caption">Risk Profile (1=Safe, 5=Risky)</Typography>
                                                                    <Slider
                                                                        value={segment.risk}
                                                                        onChange={(_, val) => setFieldValue(`segments.${index}.risk`, val)}
                                                                        step={1} min={1} max={5} marks
                                                                        size="small"
                                                                        sx={{ color: colors.redAccent[400] }}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Card>
                                                    ))}

                                                    <Button
                                                        startIcon={<AddCircleOutlineIcon />}
                                                        onClick={() => push({ ratio: 0, risk: 3, investment_goal: "balanced", time_horizon: "medium" })}
                                                        variant="outlined"
                                                        color="secondary"
                                                        fullWidth
                                                    >
                                                        Add Segment
                                                    </Button>
                                                </Box>
                                            )}
                                        </FieldArray>
                                    </Paper>

                                    {/* Action Button */}
                                    <Button
                                        onClick={submitForm}
                                        disabled={loading || !isAllocationValid}
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        sx={{
                                            mt: 2,
                                            backgroundColor: colors.blueAccent[600],
                                            color: "white",
                                            fontWeight: "bold",
                                            fontSize: "16px",
                                            "&:hover": { backgroundColor: colors.blueAccent[500] }
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : "Run Genetic Algorithm"}
                                    </Button>

                                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                                </Grid>

                                {/* --- PRAWA KOLUMNA: WYNIKI --- */}
                                <Grid item xs={12} md={8}>
                                    {!results ? (
                                        <Box height="100%" display="flex" alignItems="center" justifyContent="center" flexDirection="column" opacity={0.5}>
                                            <ShowChartIcon sx={{ fontSize: 80, color: colors.grey[500] }} />
                                            <Typography variant="h5" color={colors.grey[400]} mt={2}>
                                                Configure segments and run AI to see results
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Box display="flex" flexDirection="column" gap={3}>
                                            {/* Summary Header */}
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="h4" fontWeight="bold">Optimized Portfolio</Typography>
                                                <Chip
                                                    label={`Fitness: ${results.total_fitness.toFixed(3)}`}
                                                    color="primary"
                                                    variant="outlined"
                                                    sx={{ fontWeight: "bold", fontSize: "14px" }}
                                                />
                                            </Box>

                                            {/* Iteracja przez segmenty zwrócone z backendu */}
                                            {results.structured_portfolio.map((segmentData, idx) => (
                                                <Paper key={idx} sx={{ p: 2, backgroundColor: colors.primary[400], borderRadius: "12px" }}>
                                                    {/* Nagłówek Segmentu */}
                                                    <Box display="flex" justifyContent="space-between" mb={2} borderBottom={`1px solid ${colors.grey[700]}`} pb={1}>
                                                        <Box>
                                                            <Typography variant="h6" color={colors.greenAccent[400]} fontWeight="bold">
                                                                {segmentData.segment_params.investment_goal.toUpperCase()} Segment
                                                            </Typography>
                                                            <Typography variant="caption" color={colors.grey[300]}>
                                                                Risk: {segmentData.segment_params.risk}/5 | Horizon: {segmentData.segment_params.time_horizon}
                                                            </Typography>
                                                        </Box>
                                                        <Chip label={`${segmentData.assigned_stocks.length} stocks`} size="small" />
                                                    </Box>

                                                    {/* Lista Kafelków (Scrollable horizontally) */}
                                                    <Box sx={{
                                                        display: "flex",
                                                        overflowX: "auto",
                                                        gap: 2,
                                                        pb: 1,
                                                        "&::-webkit-scrollbar": { height: "6px" },
                                                        "&::-webkit-scrollbar-thumb": { backgroundColor: colors.blueAccent[500], borderRadius: "3px" },
                                                        "&::-webkit-scrollbar-track": { backgroundColor: colors.primary[500] }
                                                    }}>
                                                        {segmentData.assigned_stocks.map((stock) => {
                                                            // Oblicz średni score dla wizualizacji
                                                            const avgScore = (
                                                                stock.match_score.goal_score +
                                                                stock.match_score.risk_score +
                                                                stock.match_score.size_score
                                                            ) / 3;

                                                            return (
                                                                <Card
                                                                    key={stock.symbol}
                                                                    sx={{
                                                                        minWidth: "140px",
                                                                        height: "160px",
                                                                        backgroundColor: colors.primary[500],
                                                                        borderRadius: "8px",
                                                                        p: 1.5,
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        alignItems: "center",
                                                                        justifyContent: "space-between",
                                                                        border: `1px solid transparent`,
                                                                        "&:hover": { borderColor: getScoreColor(avgScore) }
                                                                    }}
                                                                >
                                                                    <Box position="relative" display="inline-flex">
                                                                        <CircularProgress
                                                                            variant="determinate"
                                                                            value={avgScore * 100}
                                                                            size={40}
                                                                            thickness={4}
                                                                            sx={{ color: getScoreColor(avgScore) }}
                                                                        />
                                                                        <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                            <Typography variant="caption" fontWeight="bold">
                                                                                {(avgScore * 100).toFixed(0)}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>

                                                                    <Box textAlign="center">
                                                                        <Typography variant="h6" fontWeight="bold">{stock.symbol}</Typography>
                                                                        <Typography variant="caption" display="block" color={colors.grey[300]} sx={{ fontSize: '9px', lineHeight: 1.1, mt: 0.5, height: '20px', overflow: 'hidden' }}>
                                                                            {stock.name}
                                                                        </Typography>
                                                                    </Box>

                                                                    <Chip
                                                                        label={stock.sector}
                                                                        size="small"
                                                                        sx={{
                                                                            fontSize: '9px',
                                                                            height: '18px',
                                                                            width: '100%',
                                                                            backgroundColor: "rgba(255,255,255,0.05)"
                                                                        }}
                                                                    />
                                                                </Card>
                                                            );
                                                        })}
                                                    </Box>
                                                </Paper>
                                            ))}

                                            {/* (Opcjonalnie) Tutaj można dodać wykres konwergencji korzystając z results.convergence */}
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                        </Form>
                    );
                }}
            </Formik>
        </Box>
    );
};

export default GARecommendationsPage;