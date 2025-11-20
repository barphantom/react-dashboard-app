import {useState, useEffect} from "react";
import {Box, Typography, CircularProgress, useTheme} from "@mui/material";
import {tokens} from "../../themes.tsx";
import PortfolioChart from "./PortfolioChart.tsx";
import {getPortfolioChartData} from "../../api/portfolioApi.tsx";
import type {NivoSeries} from "../../types/stockTypes.tsx";

interface PortfolioChartSectionProps {
    portfolioId: number;
}

const PortfolioChartSection = ({portfolioId}: PortfolioChartSectionProps) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [data, setData] = useState<NivoSeries[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function formatChartData(rawData: { time: string; value: number }[]) {
        return [
            {
                id: "Portfolio Value",
                data: rawData.map(item => ({
                    x: item.time,
                    y: item.value
                }))
            }
        ];
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const rawData = await getPortfolioChartData(portfolioId)
                const formattedData = formatChartData(rawData);
                setData(formattedData);
            } catch (error: any) {
                setError(error.message || "Error when fetching portfolio chart data");
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, []);

    if (data === null) {
        return (
            <Box>
                <Typography>
                    Loading...
                </Typography>
            </Box>
        )
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            height="100%"
            width="100%"
        >
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
                // mb={2}
            >
                <Typography variant="h3" color={colors.grey[400]}>Portfolio Value</Typography>
            </Box>

            <Box
                flex={1}
                display="flex"
                justifyContent="center"
                position="relative"
                flexDirection="column"
                mt="-10px"
            >
                {loading && <CircularProgress />}
                {error && (
                    <Typography color="error.main">
                        Error loading the data: {error}
                    </Typography>
                )}
                {/*{!loading && !error && (*/}
                {/*    <Box width="100%" height="100%">*/}
                {/*        <PortfolioChart data={data}/>*/}
                {/*    </Box>*/}
                {/*)}*/}
                {!loading && !error && data && data[0].data.length === 0 && (
                    <Typography color={colors.grey[400]} textAlign="center" pb="20px">
                        No portfolio data to display yet.
                    </Typography>
                )}

                {!loading && !error && data && data[0].data.length > 0 && (
                    <Box width="100%" height="100%">
                        <PortfolioChart data={data} />
                    </Box>
                )}

            </Box>
        </Box>
    )
}

export default PortfolioChartSection;