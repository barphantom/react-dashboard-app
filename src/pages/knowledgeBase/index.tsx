import Header from "../../components/Header.tsx";
import {tokens} from "../../themes.tsx";
import {Box, Typography, useTheme, Paper} from "@mui/material";
import {Accordion, AccordionSummary, AccordionDetails} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';


const KnowledgeBase = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Lista definicji - Baza Wiedzy
    const definitions = [
        {
            id: "beta",
            term: "Beta (β)",
            definition: "Miara zmienności zwrotu z papieru wartościowego lub portfela w stosunku do całego rynku. Beta równa 1.0 oznacza, że cena akcji porusza się w korelacji z rynkiem. Beta > 1.0 oznacza większą zmienność (większe ryzyko i potencjalny zysk), a Beta < 1.0 oznacza mniejszą zmienność (akcja bardziej stabilna)."
        },
        {
            id: "pe",
            term: "P/E Ratio (Price-to-Earnings)",
            definition: "Wskaźnik Cena/Zysk. Oblicza się go, dzieląc aktualną cenę rynkową akcji przez zysk na akcję (EPS). Pomaga ocenić, czy akcja jest przewartościowana (wysokie P/E) czy niedowartościowana (niskie P/E) w porównaniu do konkurencji lub historycznych średnich."
        },
        {
            id: "div_yield",
            term: "Dividend Yield (Stopa dywidendy)",
            definition: "Wskaźnik finansowy pokazujący, ile firma wypłaca w dywidendach każdego roku w stosunku do ceny akcji. Wyrażany w procentach. Jest to szacunkowy zwrot z samej dywidendy, jaki inwestor otrzymałby przy obecnej cenie akcji."
        },
        {
            id: "market_cap",
            term: "Market Cap (Kapitalizacja rynkowa)",
            definition: "Całkowita wartość rynkowa wyemitowanych akcji spółki w obrocie. Oblicza się ją, mnożąc liczbę akcji przez ich aktualną cenę rynkową. Pozwala określić wielkość firmy (np. Small-cap, Mid-cap, Large-cap)."
        },
        {
            id: "eps",
            term: "EPS (Earnings Per Share)",
            definition: "Zysk na akcję. Jest to część zysku spółki przypadająca na każdą wyemitowaną akcję zwykłą. EPS służy jako wskaźnik rentowności spółki i jest kluczowym składnikiem przy obliczaniu wskaźnika P/E."
        },
        {
            id: "bull_bear",
            term: "Bull vs. Bear Market",
            definition: "Bull Market (Rynek Byka) to rynek, na którym ceny akcji rosną, co zachęca do kupowania. Bear Market (Rynek Niedźwiedzia) to rynek spadkowy, na którym ceny akcji maleją, a nastroje inwestorów są pesymistyczne."
        },
    ];

    return (
        <Box m="20px">
            <Header title="Knowledge Base" subtitle="Essential Investment Definitions & Terms" />

            {/* Sekcja z Cytatem */}
            <Paper
                elevation={3}
                sx={{
                    backgroundColor: colors.primary[400],
                    p: "20px",
                    borderRadius: "8px",
                    mb: "30px",
                    borderLeft: `4px solid ${colors.greenAccent[500]}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "20px"
                }}
            >
                <FormatQuoteIcon sx={{ fontSize: "60px", color: colors.greenAccent[500], opacity: 0.5 }} />
                <Box>
                    <Typography variant="h5" fontStyle="italic" color={colors.grey[100]}>
                        "An investment in knowledge pays the best interest."
                    </Typography>
                    <Typography variant="subtitle1" color={colors.greenAccent[500]} mt="5px" fontWeight="bold">
                        — Benjamin Franklin
                    </Typography>
                </Box>
            </Paper>

            {/* Generowanie Accordionów z listy */}
            <Box display="flex" flexDirection="column" gap="10px">
                {definitions.map((item) => (
                    <Accordion
                        key={item.id}
                        defaultExpanded={false} // Domyślnie zwinięte dla porządku
                        sx={{
                            backgroundColor: colors.primary[400], // Tło z motywu
                            backgroundImage: "none", // Usunięcie domyślnego cienia/gradientu MUI
                            boxShadow: "none", // Płaski design pasujący do dashboardu
                            '&:before': {
                                display: 'none', // Usunięcie domyślnej linii separatora MUI
                            },
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                                {item.term}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography color={colors.grey[100]} lineHeight="1.6">
                                {item.definition}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Box>
    );
};

export default KnowledgeBase;