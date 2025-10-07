import React, {useState} from "react";
import {Sidebar, Menu, MenuItem } from "react-pro-sidebar"
import {useNavigate} from "react-router-dom";
// import 'react-pro-sidebar/dist/styles/StyledUl'
import { Box, IconButton, Typography, useTheme } from "@mui/material"
import { tokens } from "../../themes.tsx";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';


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
            active={selected === title}
            style={{ color: colors.grey[100] }}
            onClick={() => {
                setSelected(title);
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
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [selected, setSelected] = useState('Dashboard');

    return (
        // <Box
        //     sx={{
        //         "& .pro-sidebar-inner": {
        //             background: `${colors.primary[400]} !important`
        //         },
        //         "& .pro-icon-wrapper": {
        //             backgroundColor: "transparent !important"
        //         },
        //         "& .pro-inner-item": {
        //             padding: "5px 35px 5px 20px !important"
        //         },
        //         "& .pro-inner-item:hover": {
        //             color: "#868dfb !important"
        //         },
        //         "& .pro-menu-item.active": {
        //             color: "#6870fa !important"
        //         },
        //     }}
        // >
            <Sidebar
                collapsed={isCollapsed}
                rootStyles={{
                    width: "280px",
                    backgroundColor: colors.primary[800],
                }}
            >
                <Menu
                    menuItemStyles={{
                        button: {
                            padding: "5px 35px 5px 20px",
                            color: colors.grey[100],
                            "&:hover": {
                                color: "#868dfb",
                                backgroundColor: "#868dfb",
                            },
                            "&.ps-active": {
                                // padding: "0 5px",
                                color: "#6870fa",
                                // color: "red",
                                backgroundColor: colors.grey[700],
                                borderRadius: "5rem"
                                // backgroundColor: "purple",
                            },
                        },
                        icon: {
                            backgroundColor: "transparent",
                        },
                    }}
                >
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                        style={{
                            margin: "10px 0 20px 0",
                            color: colors.grey[100]
                        }}
                    >
                        {!isCollapsed && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="15px"
                            >
                                <Typography variant="h3" color={colors.grey[100]}>
                                    ADMINS
                                </Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {!isCollapsed && (
                        <Box mb="25px">
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <img
                                    alt="profile-user"
                                    width="100px"
                                    height="100px"
                                    src={`../../assets/user.png`}
                                    style={{ cursor: "pointer", borderRadius: "50%" }}
                                />
                            </Box>
                            <Box textAlign="center">
                                <Typography
                                    variant="h2"
                                    color={colors.grey[100]}
                                    fontWeight="bold"
                                    sx={{ m: "10px 0 0 0" }}
                                >
                                Bartek Dobrzański
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color={colors.greenAccent[800]}
                                >
                                    Standard plan
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {/* Menu items */}
                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        <Item
                            title="Dashboard"
                            to="/eq"
                            icon={<HomeOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            navigate={navigate}
                         />

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
                            color={colors.grey[700]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >Data</Typography>
                        <Item
                            title="Manage Team"
                            to="/team"
                            icon={<PeopleOutlineOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            navigate={navigate}
                         />
                        <Item
                            title="Contacts Information"
                            to="/contacts"
                            icon={<ContactsOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            navigate={navigate}
                         />
                        <Item
                            title="Invoices Balances"
                            to="/invoices"
                            icon={<ReceiptOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            navigate={navigate}
                         />
                        <Typography
                            variant="h6"
                            color={colors.grey[700]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >Pages</Typography>
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
                            title="FAQ Page"
                            to="/faq"
                            icon={<HelpOutlineOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            navigate={navigate}
                         />
                        <Typography
                            variant="h6"
                            color={colors.grey[700]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >Charts</Typography>
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
                        <Item
                            title="Geography Chart"
                            to="/geography"
                            icon={<MapOutlinedIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                            navigate={navigate}
                         />
                    </Box>
                </Menu>
            </Sidebar>
        // </Box>
    );
}

export default MySidebar;
