import React, {useState, useEffect} from "react";
import {Sidebar, Menu, MenuItem } from "react-pro-sidebar"
import {useNavigate, useLocation} from "react-router-dom";
import { Box, IconButton, Typography, Skeleton, useTheme } from "@mui/material"
import { tokens } from "../../themes.tsx";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
// import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
// import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
// import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import {useUser} from "../../components/context/useUser.ts";

type ItemProps = {
    title: string;
    to: string;
    icon: React.ReactNode;
    selected: string;
    setSelected: (value: string) => void;
    navigate: (value: string) => void;
}

const Item = ({ title, to, icon, selected, setSelected, navigate }: ItemProps) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <MenuItem
            active={selected === to}
            style={{ color: colors.grey[100] }}
            onClick={() => {
                setSelected(to);
                navigate(to);
            }}
            icon={icon}
        >
            <Typography>{title}</Typography>
        </MenuItem>
    );
};

const MySidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { user, loading } = useUser()

    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [selected, setSelected] = useState<string>(location.pathname);

    useEffect(() => {
        setSelected(location.pathname);
    }, [location.pathname]);

    return (
        <Sidebar
            collapsed={isCollapsed}
            rootStyles={{
                "&.ps-sidebar-root": {
                    width: isCollapsed ? "80px" : "260px",
                    backgroundColor: colors.primary[400],
                    color: colors.grey[100],
                    border: "none",
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    zIndex: 100,
                    transition: "all 0.3s ease",
                },
                ".ps-sidebar-container": {
                    backgroundColor: colors.blueAccent[800],
                    height: "100%",
                },
            }}
        >
            <Menu
                menuItemStyles={{
                    button: {
                        padding: isCollapsed ? "10px" : "10px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        color: colors.grey[100],
                        backgroundColor: "transparent",
                        borderRadius: "8px",
                        margin: "4px 12px",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            // color: colors.blueAccent[800],
                            backgroundColor: colors.greenAccent[600],
                            transform: isCollapsed ? "scale(1.1)" : "none",
                        },
                        "&.ps-active": {
                            color: colors.blueAccent[500],
                            backgroundColor: colors.greenAccent[800],
                            fontWeight: "600",
                            boxShadow: `0 2px 2px ${colors.blueAccent[400]}`,
                        },
                    },
                    icon: {
                        backgroundColor: "transparent",
                        color: "inherit",
                        minWidth: "auto",
                        fontSize: isCollapsed ? "1.4rem" : "1.25rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                    },
                    label: {
                        fontWeight: "inherit",
                        display: isCollapsed ? "none" : "block",
                        transition: "opacity 0.3s ease",
                    },
                }}
            >
                {/* Header z toggle */}
                <MenuItem
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                    style={{
                        margin: "10px 0 20px 0",
                        color: colors.grey[100],
                        backgroundColor: "transparent",
                    }}
                >
                    {!isCollapsed && (
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            ml="15px"
                        >
                            <Typography variant="h5" color={colors.grey[100]} fontWeight="bold">
                                PORTFOLIO APP
                            </Typography>
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCollapsed(!isCollapsed);
                                }}
                                sx={{
                                    color: colors.grey[100],
                                    "&:hover": {
                                        backgroundColor: colors.primary[500],
                                    }
                                }}
                            >
                                <MenuOutlinedIcon />
                            </IconButton>
                        </Box>
                    )}
                </MenuItem>

                {/* Profile section */}
                {!isCollapsed && (
                    <Box mb="25px" px="20px">
                        <Box textAlign="center">
                            <Typography
                                variant="h2"
                                color={colors.grey[100]}
                                fontWeight="bold"
                                sx={{ m: "10px 0 0 0" }}
                            >
                                {loading ? (
                                    <Skeleton variant="text" width={120} sx={{ mx: "auto", bgcolor: "grey.700" }} />
                                ) : (
                                    user.name && user.lastName ? `${user.name} ${user.lastName}` : "User"
                                )}
                            </Typography>
                            <Typography
                                variant="h5"
                                color={colors.greenAccent[500]}
                                fontWeight="500"
                            >
                                Welcome!
                            </Typography>
                        </Box>
                    </Box>
                )}

                {/* Menu items */}
                <Box paddingLeft={isCollapsed ? undefined : "0"}>
                    <Item
                        title="Main Dashboard"
                        to="/portfolio-dashboard"
                        icon={<HomeOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        navigate={navigate}
                    />

                    <Typography
                        variant="h6"
                        color={colors.grey[500]}
                        fontWeight="600"
                        sx={{ m: "20px 0 8px 20px", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px" }}
                    >
                        Data
                    </Typography>

                    <Item
                        title="Portfolio Performance"
                        to="/portfolio-performance"
                        icon={<TimelineOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        navigate={navigate}
                    />

                    <Item
                        title="Portfolio Positions"
                        to="/portfolio-positions"
                        icon={<ListAltOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        navigate={navigate}
                    />

                    <Item
                        title="Recommendations"
                        to="/recommendations"
                        icon={<MapOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        navigate={navigate}
                    />

                    <Typography
                        variant="h6"
                        color={colors.grey[500]}
                        fontWeight="600"
                        sx={{ m: "20px 0 8px 20px", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px" }}
                    >
                        Pages
                    </Typography>

                    <Item
                        title="Profile Form"
                        to="/form"
                        icon={<PersonOutlineOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        navigate={navigate}
                    />
                    <Item
                        title="Calendar"
                        to="/calendar"
                        icon={<CalendarTodayOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        navigate={navigate}
                    />
                    <Item
                        title="Knowledge Base"
                        to="/knowledge-base"
                        icon={<MenuBookOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        navigate={navigate}
                    />

                    <Typography
                        variant="h6"
                        color={colors.grey[500]}
                        fontWeight="600"
                        sx={{ m: "20px 0 8px 20px", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px" }}
                    >
                        Charts
                    </Typography>

                    <Item
                        title="Bar Chart"
                        to="/bar"
                        icon={<BarChartOutlinedIcon/>}
                        selected={selected}
                        setSelected={setSelected}
                        navigate={navigate}
                    />
                    <Item
                        title="Pie Chart"
                        to="/pie"
                        icon={<PieChartOutlineOutlinedIcon/>}
                        selected={selected}
                        setSelected={setSelected}
                        navigate={navigate}
                    />
                    <Item
                        title="Line Chart"
                        to="/line"
                        icon={<TimelineOutlinedIcon/>}
                        selected={selected}
                        setSelected={setSelected}
                        navigate={navigate}
                    />
                </Box>
            </Menu>
        </Sidebar>
    );
}

export default MySidebar;