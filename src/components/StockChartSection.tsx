import React, { useEffect, useRef, useState } from "react";
import { Box, Button, ButtonGroup, useTheme } from "@mui/material";
import {createChart, ColorType, CandlestickSeries} from "lightweight-charts";
import {tokens} from "../themes.tsx";
import type {Candle, StockChartSectionProps} from "../types/stockTypes.tsx";

const StockChartSection: React.FC<StockChartSectionProps> = ({ symbol }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [chartData, setChartData] = useState<Candle[]>([])
    const [range, setRange] = useState<"1M" | "3M" | "1Y" | "ALL">("1M");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 🔹 Później zamienisz na realne API
                // const res = await fetch(`/api/stocks/${symbol}/chart?range=${range}`);
                // const data = await res.json();
                // setChartData(data);

                // 🔹 Dummy dane do testów
                const dummy: Candle[] = [
                    { time: "2025-09-01", open: 200, high: 210, low: 195, close: 205 },
                    { time: "2025-09-02", open: 205, high: 212, low: 202, close: 210 },
                    { time: "2025-09-03", open: 210, high: 215, low: 207, close: 208 },
                    { time: "2025-09-04", open: 208, high: 220, low: 205, close: 218 },
                    { time: "2025-09-05", open: 218, high: 225, low: 215, close: 222 },
                    { time: "2025-09-06", open: 222, high: 226, low: 218, close: 225 },
                ];
                setChartData(dummy);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [symbol, range]);

    useEffect(() => {
        if (!chartContainerRef.current || chartData.length === 0) return;

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
        });

        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: "#4fff8f",
            borderUpColor: "#4fff8f",
            wickUpColor: "#4fff8f",
            downColor: "#ff4976",
            borderDownColor: "#ff4976",
            wickDownColor: "#ff4976",
        });

        candleSeries.setData(chartData);

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chart.remove();
        };
    }, [chartData, colors]);


    return (
        <Box>
            {/* Przyciski zakresu */}
            <Box display="flex" justifyContent="flex-end" mb={1}>
                <ButtonGroup variant="outlined" size="small">
                    {["1M", "3M", "1Y", "ALL"].map((r) => (
                        <Button
                            key={r}
                            onClick={() => setRange(r as any)}
                            sx={{
                                backgroundColor: range === r ? colors.greenAccent[500] : colors.primary[400],
                                color: range === r ? "#000" : colors.grey[100],
                                "&:hover": { backgroundColor: colors.greenAccent[400] },
                            }}
                        >
                            {r}
                        </Button>
                    ))}
                </ButtonGroup>
            </Box>

            {/* Wykres */}
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
}

export default StockChartSection;