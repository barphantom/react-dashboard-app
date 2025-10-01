import {Box} from "@mui/material";
import Header from "../../components/Header.tsx";
import PortfolioChart from "../../components/PortfolioChart.tsx";


const PortfolioValue = () => {
    return (
        <Box m="20px">
            <Header title="Portfolio value" subtitle="Simple Line Chart" />
            <Box height="75vh">
                <PortfolioChart />
            </Box>
        </Box>
    )
}

export default PortfolioValue