import {useState, useEffect} from "react";
import {Box, Typography, CircularProgress, Button, ButtonGroup, useTheme} from "@mui/material";
import {tokens} from "../../themes.tsx";
import {getPortfolioHistory, type PortfolioHistoryData} from "../../api/portfolioApi.tsx";
import PortfolioChart from "./PortfolioChart.tsx";
import PortfolioChartNew from "./PortfolioChartNew.tsx";

const PortfolioChartSection = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // const [timeRange, setTimeRange] = useState("1M");
    // const [data, setData] = useState<PortfolioHistoryData | null>(null);
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     setLoading(true);
    //     setError(null);
    //
    //     getPortfolioHistory(timeRange)
    //         .then(setData)
    //         .catch(err => setError(err.message))
    //         .finally(() => setLoading(false));
    // }, [timeRange]);


    return (
        <Box
            display="flex"
            flexDirection="column"
            height="100%"
            width="100%"
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                mb={2}
            >
                <Typography variant="h3" color={colors.grey[400]}>Portfolio Value</Typography>
                {/*<ButtonGroup variant="outlined" color="primary">*/}
                {/*    {ranges.map(range => (*/}
                {/*        <Button*/}
                {/*            key={range}*/}
                {/*            variant={timeRange === range ? "contained" : "outlined"}*/}
                {/*            onClick={() => setTimeRange(range)}*/}
                {/*            size="small"*/}
                {/*            sx={{*/}
                {/*                color: colors.greenAccent[400],*/}
                {/*                borderColor: colors.greenAccent[400],*/}
                {/*                '&:hover': {*/}
                {/*                    backgroundColor: colors.greenAccent[800],*/}
                {/*                    borderColor: colors.greenAccent[400],*/}
                {/*                },*/}
                {/*                ...(timeRange === range && {*/}
                {/*                    backgroundColor: colors.greenAccent[400],*/}
                {/*                    color: colors.primary[400],*/}
                {/*                    '&:hover': {*/}
                {/*                        backgroundColor: colors.greenAccent[500],*/}
                {/*                    }*/}
                {/*                })*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            {range}*/}
                {/*        </Button>*/}
                {/*    ))}*/}
                {/*</ButtonGroup>*/}
            </Box>

            <Box
                flex={1}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                position="relative"
                // minHeight="200px"
            >
                {/*{loading && (*/}
                {/*    <Box*/}
                {/*        display="flex"*/}
                {/*        justifyContent="center"*/}
                {/*        alignItems="center"*/}
                {/*        height="100%"*/}
                {/*    >*/}
                {/*        <CircularProgress />*/}
                {/*    </Box>*/}
                {/*)}*/}

                {/*{error && (*/}
                {/*    <Box*/}
                {/*        display="flex"*/}
                {/*        justifyContent="center"*/}
                {/*        alignItems="center"*/}
                {/*        height="100%"*/}
                {/*        color="error.main"*/}
                {/*    >*/}
                {/*        <Typography>Error: {error}</Typography>*/}
                {/*    </Box>*/}
                {/*)}*/}

                {/*{data && !loading && !error && (*/}
                    <Box
                        height="100%"
                        width="100%"
                    >
                        <PortfolioChart />
                        {/*<PortfolioChartNew portfolioId={3}/>*/}
                    </Box>
                {/*)}*/}

            </Box>

            {/*{loading && (*/}
            {/*    <Box height="1000px" display="flex" justifyContent="center" p="10px">*/}
            {/*        <CircularProgress />*/}
            {/*    </Box>*/}
            {/*)}*/}

            {/*{error && (*/}
            {/*    <Box color="error.main" p="2px">*/}
            {/*        Error: {error}*/}
            {/*    </Box>*/}
            {/*)}*/}

            {/*{data && !loading && !error && (*/}
            {/*    <Box height="180px" width="900px" mb="20px">*/}
            {/*        <PortfolioChart />*/}
            {/*    </Box>*/}
            {/*)}*/}
        </Box>
    )
}

export default PortfolioChartSection;