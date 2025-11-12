import {Box, Typography, useTheme} from '@mui/material';
import {tokens} from "../themes.tsx";
import type {ReactNode} from "react";

type StatsBoxType = {
    title?: string,
    amount?: string,
    icon?: ReactNode,
    increase?: string,
}

const StatsBox = ({title, amount, icon} : StatsBoxType) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box width="100%" m="0 30px" display="flex" justifyContent="space-between">
            <Box display="flex" flexDirection="column" alignItems="flex-start">
                <Typography variant="h5" fontWeight="bold" sx={{color: colors.grey[400]}}>
                    {title}
                </Typography>
                <Typography variant="h2" sx={{color: colors.greenAccent[500]}}>
                    {amount}
                </Typography>
                {/*<Typography variant="h5" fontStyle="italic" sx={{color: colors.grey[100]}}>*/}
                {/*    {increase}%*/}
                {/*</Typography>*/}
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
                {icon}
            </Box>
        </Box>
    )
};

export default StatsBox