import Sidebar from "../pages/global/Sidebar.tsx"
import Topbar from "../pages/global/Topbar.tsx"
import { Outlet } from 'react-router-dom';
import {Box} from "@mui/material";

const AppLayout = () => {
    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                minHeight: "100vh",
            }}
        >
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "auto",
                    minWidth: 0,
                }}
            >
                <Topbar />
                <Box>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    )
}

export default AppLayout;