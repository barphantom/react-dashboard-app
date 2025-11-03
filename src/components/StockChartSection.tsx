import React, { useEffect, useRef } from "react";
import { Box, useTheme } from "@mui/material";
import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";
import { tokens } from "../themes.tsx";
import type { Candle } from "../types/stockTypes.tsx";

interface StockChartSectionProps {
    symbol: string;
    data: Candle[];
}

const StockChartSection: React.FC<StockChartSectionProps> = ({ symbol, data }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartContainerRef.current || data.length === 0) return;

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

        candleSeries.setData(data);

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chart.remove();
        };
    }, [data, colors]);

    return (
        <Box>
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

export default StockChartSection;
