import {Box, Typography, useTheme} from '@mui/material';
import {tokens} from "../../themes.tsx";
import StatBox2 from "../../components/StatBox2.tsx";
import PortfolioChartSection from "../../components/PortfolioDashboard/PortfolioChartSection.tsx";
import Header from "../../components/Header.tsx";
import PieChart from "../../components/PieChart.tsx";
import EmailIcon from "@mui/icons-material/Email";


const MainDashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

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
                        amount="1'000'000$"
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
                        amount="52'000$"
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
                        title="Annual Return"
                        amount="52.12%"
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
                        title="Today"
                        amount="112.34$"
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