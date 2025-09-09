import Header from "../../components/Header.tsx";
import {Box} from "@mui/material";

const Dashboard = () => {
    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="end">
                <Header title="DASHBOARD" subtitle="Welcome to your dashboard"></Header>
            </Box>
        </Box>
    );
}

export default Dashboard;