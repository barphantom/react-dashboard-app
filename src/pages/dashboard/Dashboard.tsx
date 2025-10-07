import Header from "../../components/Header.tsx";
import {Box, Button, IconButton, Typography, useTheme} from "@mui/material";
import {tokens} from "../../themes.tsx";
import {mockTransactions} from "../../data/mockData.ts";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import LineChart from "../../components/LineChart.tsx";
import StatBox from "../../components/StatBox.tsx";
import PieChart from "../../components/PieChart";
import BarChart from "../../components/BarChart.tsx";
import ProgressCircle from "../../components/ProgressCircle.tsx";
// import {Download} from "@mui/icons-material";


const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between">
                <Box display="flex" justifyContent="space-between" alignItems="end">
                    <Header title="DASHBOARD" subtitle="Welcome to your dashboard"></Header>
                </Box>

                <Box>
                    <Button
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                        }}
                    >
                        <DownloadOutlinedIcon sx={{mr: "10px"}} />
                        Download Reports
                    </Button>
                </Box>
            </Box>

            {/*  Grid & Charts  */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="140px"
                gap="20px"
            >
            {/*  Row 1  */}
                <Box
                    sx={{
                        gridColumn: "span 3",
                        backgroundColor: colors.primary[400],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <StatBox
                        title="12,361"
                        amount="Welcome to your dashboard"
                        icon={<EmailIcon sx={{color: colors.greenAccent[600], fontSize: "26px"}} />}
                        progress="0.5"
                        increase="+14"
                    />
                </Box>

                <Box
                    sx={{
                        gridColumn: "span 3",
                        backgroundColor: colors.primary[400],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <StatBox
                        title="431,225"
                        amount="Emails Sent"
                        icon={<PointOfSaleIcon sx={{color: colors.greenAccent[600], fontSize: "26px"}} />}
                        progress="0.75"
                        increase="+30"
                    />
                </Box>

                <Box
                    sx={{
                        gridColumn: "span 3",
                        backgroundColor: colors.primary[400],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <StatBox
                        title="32,441"
                        amount="New Clients"
                        icon={<PersonAddIcon sx={{color: colors.greenAccent[600], fontSize: "26px"}} />}
                        progress="0.3"
                        increase="+5"
                    />
                </Box>

                <Box
                    sx={{
                        gridColumn: "span 3",
                        backgroundColor: colors.primary[400],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <StatBox
                        title="1,325,134"
                        amount="Traffic Inbound"
                        icon={<TrafficIcon sx={{color: colors.greenAccent[600], fontSize: "26px"}} />}
                        progress="0.80"
                        increase="+43"
                    />
                </Box>

            {/*  Row 2  */}
                <Box
                    sx={{
                        gridColumn: "span 8",
                        gridRow: "span 2",
                        backgroundColor: colors.primary[400],
                    }}
                >
                    <Box
                        sx={{
                            mt: "25px",
                            p: "0 30px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Box>
                            <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>Revenue Generated</Typography>
                            <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>59,350$</Typography>
                        </Box>

                        <Box>
                            <IconButton>
                                <DownloadOutlinedIcon
                                    sx={{
                                        fontSize: "26px",
                                        color: colors.greenAccent[500],
                                    }}
                                />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box height="250px" m="-20px">
                        <LineChart isDashboard={true} />
                    </Box>
                </Box>

                {/* Transactions */}
                <Box
                    sx={{
                        gridColumn: "span 4",
                        gridRow: "span 2",
                        backgroundColor: colors.primary[400],
                        overflow: "auto",
                    }}
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderBottom={`4px solid ${colors.primary[500]}`}
                        color={colors.grey[100]}
                        p="15px"
                    >
                        <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                            Recent Transactions
                        </Typography>
                    </Box>
                    {mockTransactions.map((trans, i) => (
                        <Box
                            key={`${trans.txId}-${i}`}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottom={`4px solid ${colors.primary[500]}`}
                            p="15px"
                        >
                            <Box>
                                <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                                    {trans.txId}
                                </Typography>
                                <Typography color={colors.grey[100]}>
                                    {trans.user}
                                </Typography>
                            </Box>
                            <Box color={colors.grey[100]}>
                                {trans.date}
                            </Box>
                            <Box sx={{backgroundColor: colors.greenAccent[500], p: "5px 10px", borderRadius: "4px"}}>
                                {trans.cost}$
                            </Box>
                        </Box>
                    ))}
                </Box>

            {/*  Row 3  */}
                <Box
                    sx={{
                        gridColumn: "span 4",
                        gridRow: "span 2",
                        backgroundColor: colors.primary[400],
                        p: "30px",
                    }}
                >
                    <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                        Campaign
                    </Typography>
                    <Box display="flex" justifyContent="column" alignItems="center" mt="25px">
                        <ProgressCircle size="125"/>
                        <Typography variant="h5" color={colors.greenAccent[500]} sx={{mt: "15px"}}>
                            50,000$ Revenue Generated
                        </Typography>
                        <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                            Includes costs
                        </Typography>
                    </Box>
                </Box>

                {/* Sales Quantity Tile */}
                <Box
                    sx={{
                        gridColumn: "span 4",
                        gridRow: "span 2",
                        backgroundColor: colors.primary[400],
                    }}
                >
                    <Typography variant="h5" fontWeight="600" sx={{p: "30px 30px 0 30px"}}>
                        Sales Quantity
                    </Typography>
                    <Box
                        height="250px"
                        mt="-20px"
                    >
                        <BarChart isDashboard={true} />
                    </Box>
                </Box>

                {/* Portfolio Representation Tile */}
                <Box
                    sx={{
                        gridColumn: "span 4",
                        gridRow: "span 2",
                        backgroundColor: colors.primary[400],
                    }}
                >
                    <Typography variant="h5" fontWeight="600" sx={{p: "30px 30px 0 30px"}}>
                        Portfolio representation
                    </Typography>
                    <Box
                        height="250px"
                        mt="-20px"
                    >
                        <PieChart />
                    </Box>
                </Box>

            </Box>
        </Box>
    );
}

export default Dashboard;