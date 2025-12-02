import React, { useEffect, useRef, useState } from "react";
import api from "../../api/axiosConfig.ts";
import { Box, useTheme } from "@mui/material";
import { createChart, ColorType, LineSeries } from "lightweight-charts";
import {tokens} from "../../themes.tsx";
import type { PortfolioDataPoint, PortfolioChartNewProps } from "../../types/stockTypes.tsx";


const PortfolioChartNew: React.FC<PortfolioChartNewProps> = ({portfolioId}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [chartData, setChartData] = useState<PortfolioDataPoint[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`portfolio/${portfolioId}/chart/`)
                const data = await response.data;
                setChartData(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [portfolioId]);

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
            rightPriceScale: {
                visible: true,
                borderColor: colors.grey[700],
            },
            timeScale: {
                borderColor: colors.grey[700],
                timeVisible: true,
                secondsVisible: false,
                fixLeftEdge: true, // 🔹 utrzymuje linię od lewej krawędzi
                fixRightEdge: true, // 🔹 utrzymuje linię do prawej krawędzi
            },
        });

        const lineSeries = chart.addSeries(LineSeries, {
            color: colors.greenAccent[500], // Kolor linii
            lineWidth: 2,
        });

        lineSeries.setData(chartData);

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
            {/* Przyciski zakresu - możesz zostawić lub usunąć */}
            {/*<Box display="flex" justifyContent="flex-end" mb={1}>*/}
            {/*    <ButtonGroup variant="outlined" size="small">*/}
            {/*        {["1M", "3M", "1Y", "ALL"].map((r) => (*/}
            {/*            <Button*/}
            {/*                key={r}*/}
            {/*                onClick={() => setRange(r as any)}*/}
            {/*                sx={{*/}
            {/*                    backgroundColor: range === r ? colors.greenAccent[500] : colors.primary[400],*/}
            {/*                    color: range === r ? "#000" : colors.grey[100],*/}
            {/*                    "&:hover": { backgroundColor: colors.greenAccent[400] },*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                {r}*/}
            {/*            </Button>*/}
            {/*        ))}*/}
            {/*    </ButtonGroup>*/}
            {/*</Box>*/}

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

export default PortfolioChartNew;