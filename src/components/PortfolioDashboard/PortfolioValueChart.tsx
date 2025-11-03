import React, { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { createChart, ColorType, LineSeries, type IChartApi, type ISeriesApi } from "lightweight-charts";
import { tokens } from "../../themes.tsx";
import api from "../../api/axiosConfig.ts";

interface PortfolioValueChartProps {
    portfolioId: number;
}

interface ChartDataPoint {
    time: string;
    value: number;
}

interface ChartResponse {
    chart: ChartDataPoint[];
    warnings?: string[];
}

const PortfolioValueChart: React.FC<PortfolioValueChartProps> = ({ portfolioId }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);

    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [warnings, setWarnings] = useState<string[]>([]);

    // Fetch chart data from backend
    useEffect(() => {
        if (!portfolioId) return;

        const fetchChartData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get<ChartResponse>(`/portfolio/${portfolioId}/chart/`);
                setChartData(response.data.chart);
                if (response.data.warnings) {
                    setWarnings(response.data.warnings);
                }
            } catch (err: any) {
                console.error("Failed to fetch chart data:", err);
                if (err.response?.status === 429) {
                    setError("API rate limit reached. Please try again later.");
                } else if (err.response?.status === 400) {
                    setError(err.response?.data?.error || "Portfolio is empty or has no data.");
                } else {
                    setError("Failed to load chart data.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [portfolioId]);

    // Initialize and update chart
    useEffect(() => {
        if (!chartContainerRef.current || chartData.length === 0) return;

        // Create chart if it doesn't exist
        if (!chartRef.current) {
            const chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: colors.primary[400] },
                    textColor: colors.grey[100],
                },
                grid: {
                    vertLines: { color: colors.primary[500] },
                    horzLines: { color: colors.primary[500] },
                },
                width: chartContainerRef.current.clientWidth,
                height: 400,
                rightPriceScale: {
                    borderColor: colors.grey[700],
                },
                timeScale: {
                    borderColor: colors.grey[700],
                    timeVisible: true,
                },
                crosshair: {
                    mode: 1,
                    vertLine: {
                        color: colors.grey[600],
                        width: 1,
                        style: 2,
                    },
                    horzLine: {
                        color: colors.grey[600],
                        width: 1,
                        style: 2,
                    },
                },
            });

            const lineSeries = chart.addSeries(LineSeries, {
                color: colors.greenAccent[500],
                lineWidth: 2,
                priceFormat: {
                    type: 'price',
                    precision: 2,
                    minMove: 0.01,
                },
            });

            chartRef.current = chart;
            seriesRef.current = lineSeries;
        }

        // Update series data
        if (seriesRef.current) {
            seriesRef.current.setData(chartData);
            chartRef.current?.timeScale().fitContent();
        }

        // Handle resize
        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth
                });
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [chartData, colors]);

    // Cleanup chart on unmount
    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
                seriesRef.current = null;
            }
        };
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                <CircularProgress />
                <Typography ml={2} color={colors.grey[100]}>
                    Loading chart data...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                <Typography color="error" align="center">
                    {error}
                </Typography>
            </Box>
        );
    }

    if (chartData.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                <Typography color={colors.grey[300]} align="center">
                    No chart data available. Add stocks to your portfolio to see the value history.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {warnings.length > 0 && (
                <Box mb={2} p={1} bgcolor={colors.primary[500]} borderRadius="8px">
                    <Typography variant="caption" color={colors.redAccent[400]}>
                        Warnings: {warnings.join(", ")}
                    </Typography>
                </Box>
            )}
            <Box
                ref={chartContainerRef}
                sx={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: `1px solid ${colors.grey[700]}`,
                    background: colors.primary[400],
                }}
            />
        </Box>
    );
};

export default PortfolioValueChart;