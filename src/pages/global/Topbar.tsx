import { Box, IconButton, useTheme, Dialog, DialogTitle, DialogActions, Button, Snackbar, Alert } from "@mui/material";
import {useContext, useState} from "react";
import { ColorModeContext } from "../../themes.tsx";
// import {InputBase} from "@mui/material";
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
// import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import StockSearch from "../../components/StockSearch.tsx";
import {logout} from "../../api/auth.ts";


const Topbar = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    const [openDialog, setOpenDialog] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleLogoutClick = () => {
        setOpenDialog(true);
    };

    const handleConfirmLogout = () => {
        setOpenDialog(false);
        setSnackbarOpen(true);
        setTimeout(() => {
            logout();
        }, 2000);
    };

    const handleCancelLogout = () => {
        setOpenDialog(false);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            <Box sx={{ width: "400px" }}>
                <StockSearch />
            </Box>

            <Box display="flex">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === 'dark' ? (
                        <DarkModeOutlinedIcon />
                    ) : (
                        <LightModeOutlinedIcon />
                    )}
                </IconButton>

                <IconButton>
                    <NotificationsOutlinedIcon />
                </IconButton>

                <IconButton onClick={handleLogoutClick}>
                    <LogoutOutlinedIcon />
                </IconButton>

                <IconButton>
                    <SettingsOutlinedIcon />
                </IconButton>

                <IconButton>
                    <PersonOutlineOutlinedIcon />
                </IconButton>
            </Box>

            <Dialog open={openDialog} onClose={handleCancelLogout}>
                <DialogTitle>Are you sure you want to log out?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCancelLogout} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmLogout} color="error" autoFocus>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
                    You have been logged out successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Topbar;
