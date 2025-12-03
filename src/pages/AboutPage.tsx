import React from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Divider,
    Chip,
    Avatar,
    Stack, useTheme
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import {tokens} from "../themes.tsx";

const AboutPage: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Container component="main" maxWidth="md" sx={{ py: 4 }}>

            <Paper elevation={3} component="header" sx={{ p: 4, mb: 4, borderRadius: 2, textAlign: 'center', backgroundColor: colors.blueAccent[800] }}>
                <Avatar sx={{ width: 80, height: 80, margin: '0 auto', mb: 2, backgroundColor: colors.greenAccent[400] }}>
                    <CodeIcon fontSize="large" />
                </Avatar>

                <Typography component="h1" variant="h3" fontWeight="bold" gutterBottom>
                    About This Project
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    An investing dashboard built with React, Django & Material UI
                </Typography>
            </Paper>

            <Stack spacing={4}>
                <Box component="section">
                    <Typography component="h2" variant="h4" gutterBottom sx={{color: colors.primary[100], fontWeight: 700}}>
                        Project Vision
                    </Typography>
                    <Typography variant="body1" paragraph>
                        The goal of this application is to provide investors with a powerful tool for analyzing and managing their portfolios efficiently.
                    </Typography>
                    <Typography variant="body1">
                        By using Python and React, we can deliver interactive UI and real-time data into the market.
                    </Typography>
                </Box>

                <Divider />

                <Box component="section">
                    <Typography component="h2" variant="h4" gutterBottom sx={{color: colors.primary[100], fontWeight: 700}}>
                        Technology Used
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: "center", gap: 2, flexWrap: 'wrap', mt: 2 }}>
                        {['React', 'TypeScript', 'Material UI', 'Django', 'PostgreSQL', 'Docker'].map((tech) => (
                            <Chip key={tech} label={tech} variant="outlined" sx={{color: colors.greenAccent[400]}} />
                        ))}
                    </Box>
                </Box>

                <Paper component="aside" elevation={1} sx={{ p: 3, borderLeft: `4px solid ${colors.blueAccent[200]}`, backgroundColor: colors.blueAccent[800] }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                        Did you know?
                    </Typography>
                    <Typography variant="body2" fontStyle="italic">
                        "The stock market is filled with individuals who know the price of everything, but the value of nothing." — Philip Fisher
                    </Typography>
                </Paper>
            </Stack>

            <Box component="footer" sx={{ mt: 8, pt: 3, borderTop: '1px solid #ddd', textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Created by <strong>Bartek Dobrzański</strong>
                </Typography>

                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Last update: <time dateTime="2025-12-03">December 3, 2025</time>
                </Typography>

                <Box component="address" sx={{ mt: 1, fontStyle: 'normal' }}>
                    <Typography variant="caption">
                        Contact: <a href="mailto:admin@stockapp.com" style={{ color: 'inherit'}}>admin@stockapp.com</a>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default AboutPage;