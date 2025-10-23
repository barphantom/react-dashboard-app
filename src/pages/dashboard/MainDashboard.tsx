import {useEffect, useState} from "react";
import {Box, CircularProgress, Typography, useTheme} from '@mui/material';
import {tokens} from "../../themes.tsx";
import StatBox2 from "../../components/StatBox2.tsx";
import PortfolioChartSection from "../../components/PortfolioDashboard/PortfolioChartSection.tsx";
import Header from "../../components/Header.tsx";
import PieChart from "../../components/PieChart.tsx";
import EmailIcon from "@mui/icons-material/Email";
import {getPortfolioStats, type PortfolioStats} from "../../api/portfolioApi.tsx";


const MainDashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const portfolioId = 3

    const [stats, setStats] = useState<PortfolioStats | null>(null);
    const [loadingStats, setLoadingStats] = useState<boolean>(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getPortfolioStats(portfolioId);
                setStats(data);
            } catch (error) {
                console.error("Failed to load portfolio stats", error);
            } finally {
                setLoadingStats(false);
            }
        }
        fetchStats();
    }, [portfolioId]);

    if (loadingStats) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
                <Typography>
                    Loading...
                </Typography>
            </Box>
        );
    }

    return (
        <Box m="20px">
            <Header title="Portfolio" subtitle="" />
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridTemplateRows="repeat(5, 1fr)"
                gap="20px"
                height="75vh"
            >
                <Box
                    sx={{
                        gridColumn: "span 3",
                        gridRow: "span 1",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.primary[400],
                        borderRadius: "1.5rem",
                    }}
                >
                    <StatBox2
                        title="Total Value"
                        amount={`$${stats?.total_value.toLocaleString()}`}
                        icon={<EmailIcon sx={{color: colors.greenAccent[600], fontSize: "36px"}} />}
                        increase="+14"
                    />
                </Box>

                <Box
                    sx={{
                        gridColumn: "span 3",
                        gridRow: "span 1",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.primary[400],
                        borderRadius: "1.5rem",
                    }}
                >
                    <StatBox2
                        title="Profit"
                        amount={`$${stats?.profit_value.toLocaleString()}`}
                        icon={<EmailIcon sx={{color: colors.greenAccent[600], fontSize: "36px"}} />}
                        increase="+5.2"
                    />
                </Box>

                <Box
                    sx={{
                        gridColumn: "span 3",
                        gridRow: "span 1",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.primary[400],
                        borderRadius: "1.5rem",
                    }}
                >
                    <StatBox2
                        title="Profit percent"
                        amount={`${stats?.profit_percent.toFixed(2)}%`}
                        icon={<EmailIcon sx={{color: colors.greenAccent[600], fontSize: "36px"}} />}
                        increase="+14"
                    />
                </Box>

                <Box
                    sx={{
                        gridColumn: "span 3",
                        gridRow: "span 1",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.primary[400],
                        borderRadius: "1.5rem",
                    }}
                >
                    <StatBox2
                        title="Weekly change"
                        amount={`${stats?.weekly_change_percent.toFixed(2)}%`}
                        icon={<EmailIcon sx={{color: colors.greenAccent[600], fontSize: "36px"}} />}
                        increase="+0.12"
                    />
                </Box>

                {/* Row 2 */}
                <Box
                    sx={{
                        gridColumn: "span 12",
                        gridRow: "span 2",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: colors.primary[400],
                        borderRadius: "1.5rem",
                        p: 2,
                        position: "relative",
                        // justifyContent: "center",
                        // alignItems: "center",
                    }}
                >
                    {/*<Box>*/}
                        <PortfolioChartSection />
                    {/*</Box>*/}
                </Box>

                {/* Row 3 */}
                <Box
                    sx={{
                        gridColumn: "span 4",
                        gridRow: "span 2",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.primary[400],
                        borderRadius: "1.5rem",
                    }}
                >
                    <Typography>
                        Assets
                    </Typography>
                </Box>

                <Box
                    sx={{
                        gridColumn: "span 8",
                        gridRow: "span 2",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.primary[400],
                        borderRadius: "1.5rem",
                    }}
                >
                    <Typography>
                        Portfolio by sector
                    </Typography>
                    <Box height="500px" width="300px" mt="-20px">
                        <PieChart />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default MainDashboard;