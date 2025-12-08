import Sidebar from "../pages/global/Sidebar.tsx"
import Topbar from "../pages/global/Topbar.tsx"
import { Outlet } from 'react-router-dom';
import {Box} from "@mui/material";
import {useRef} from "react";
import {SearchRefContext} from "../components/context/SearchRefContext.ts";

const AppLayout = () => {
    const searchInputRef = useRef<HTMLInputElement | null>(null);

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
                <SearchRefContext.Provider value={searchInputRef}>
                    <Topbar />
                    <Box>
                        <Outlet />
                    </Box>
                </SearchRefContext.Provider>
            </Box>
        </Box>
    )
}

export default AppLayout;