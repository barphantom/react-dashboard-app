import React, { useEffect, useRef } from "react";
import { Box, useTheme } from "@mui/material";
import {
    createChart,
    ColorType,
    type IChartApi,
    type ISeriesApi,
    type MouseEventParams,
    CandlestickSeries
} from "lightweight-charts";
import { tokens } from "../themes.tsx";
import type { Candle } from "../types/stockTypes.tsx";

interface StockChartSectionProps {
    data: Candle[];
    onChartClick?: (candle: Candle) => void;
}

const StockChartSection: React.FC<StockChartSectionProps> = ({ data, onChartClick }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

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
            crosshair: {
                mode: 1,
                vertLine: {
                    color: colors.blueAccent[500],
                    width: 1,
                    style: 3, // Dashed line
                    labelBackgroundColor: colors.blueAccent[700],
                },
                horzLine: {
                    color: colors.blueAccent[500],
                    width: 1,
                    style: 3,
                    labelBackgroundColor: colors.blueAccent[700],
                },
            },
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

        chartRef.current = chart;
        candleSeriesRef.current = candleSeries;

        const handleChartClick = (param: MouseEventParams) => {
            if (!param.time || !onChartClick) return;

            const clickedCandle = data.find(candle => {
                const candleTime = typeof candle.time === 'string'
                    ? new Date(candle.time).getTime() / 1000
                    : candle.time;
                const clickTime = typeof param.time === 'string'
                    ? new Date(param.time).getTime() / 1000
                    : param.time;

                return candleTime === clickTime;
            });

            if (clickedCandle) {
                onChartClick(clickedCandle);
            }
        };

        chart.subscribeClick(handleChartClick);

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
        };
        window.addEventListener("resize", handleResize);

        return () => {
            chart.unsubscribeClick(handleChartClick);
            window.removeEventListener("resize", handleResize);
            chart.remove();
            chartRef.current = null;
            candleSeriesRef.current = null;
        };
    }, [data, colors, onChartClick]);

    return (
        <Box>
            <Box
                ref={chartContainerRef}
                sx={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: `1px solid ${colors.grey[700]}`,
                    background: colors.primary[400],
                    cursor: onChartClick ? 'pointer' : 'default',
                    '&:hover': onChartClick ? {
                        borderColor: colors.blueAccent[500],
                    } : {},
                }}
            />
        </Box>
    );
};

export default StockChartSection;