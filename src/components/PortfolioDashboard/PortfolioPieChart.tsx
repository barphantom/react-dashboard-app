import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../themes.tsx";
import { getPortfolioComposition } from "../../api/portfolioApi.tsx";
import type { NivoPieItem } from "../../types/stockTypes.tsx";


interface PortfolioPieChartProps {
    portfolioId: number;
}

const PortfolioPieChart = ({ portfolioId }: PortfolioPieChartProps) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [data, setData] = useState<NivoPieItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getPortfolioComposition(portfolioId);
                setData(result);
            } catch (err: any) {
                setError(err.message || "Error fetching composition data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [portfolioId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error.main" align="center">
                {error}
            </Typography>
        );
    }

    if (data.length === 0) {
        return (
            <Typography align="center" color={colors.grey[400]}>
                No assets to display
            </Typography>
        );
    }

    return (
        <ResponsivePie
            data={data}
            theme={{
                legends: {
                    text: {
                        fill: colors.grey[100],
                    },
                },
                tooltip: {
                    container: {
                        background: colors.primary[400],
                        color: colors.greenAccent[400],
                        fontSize: 14,
                        borderRadius: "6px",
                        padding: "8px 12px",
                    },
                },
            }}
            margin={{ top: 30, right: 140, bottom: 40, left: 40 }}
            innerRadius={0.5}
            padAngle={1}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor={colors.grey[100]}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
            legends={[
                {
                    anchor: "right",
                    direction: "column",
                    translateX: 130,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemsSpacing: 4,
                    symbolSize: 14,
                    symbolShape: "circle",
                    itemTextColor: colors.grey[100],
                },
            ]}
            tooltip={({ datum }) => (
                <div>
                    <strong>{datum.label}</strong>
                    <br />
                    {datum.value.toLocaleString()} USD
                    <br />
                    ({datum.data.percentage}%)
                </div>
            )}
        />
    );
};

export default PortfolioPieChart;
