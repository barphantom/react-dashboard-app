import {Box, Typography, useTheme} from "@mui/material";
import Header from "../../components/Header.tsx";
import {Accordion, AccordionSummary, AccordionDetails} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {tokens} from "../../themes.tsx";


const FAQ = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box m="20px">
            <Header title="FAQ" subtitle="Frequently Asked Questions Page"/>

            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                        What is the best anime film?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Why is Koe No Katachi the best anime film ever produced?
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                        What is the best medieval fantasy
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Why is Koe No Katachi the best anime film ever produced?
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                        An important question
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Why is Koe No Katachi the best anime film ever produced?
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                        An important question
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Why is Koe No Katachi the best anime film ever produced?
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color={colors.greenAccent[500]} variant="h5">
                        An important question
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Why is Koe No Katachi the best anime film ever produced?
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}

export default FAQ;