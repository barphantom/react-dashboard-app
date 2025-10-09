import {useState, useEffect} from "react";
import {Autocomplete, TextField, CircularProgress, useTheme} from "@mui/material";
import {tokens} from "../themes.tsx";
import {searchStocks} from "../api/portfolioApi.tsx";
import {type StockSearchResult} from "../types/stockTypes.tsx";
import {useNavigate} from "react-router-dom";

const StockSearch = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<StockSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (query.length < 2) {
            setOptions([]);
            return;
        }

        const timeout = setTimeout(() => {
            setLoading(true);
            searchStocks(query)
                .then(setOptions)
                .finally(() => setLoading(false));
        }, 400)

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <Autocomplete
            freeSolo
            loading={loading}
            options={options}
            getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
            onInputChange={(_, value) => setQuery(value)}
            onChange={(_, value) => {
                if (value) {
                    navigate(`/stock/${value.sybmol}`);
                }
            }}
            sx={{
                "& .MuiAutocomplete-paper": {
                    backgroundColor: colors.primary[500],
                    color: colors.grey[100],
                },
                "& .MuiAutocomplete-listbox": {
                    backgroundColor: colors.primary[500],
                    "& .MuiAutocomplete-option": {
                        color: colors.grey[100],
                        "&:hover": {
                            backgroundColor: colors.primary[600],
                        },
                        "&[aria-selected='true']": {
                            backgroundColor: colors.primary[700],
                        },
                        "&[aria-selected='true'].Mui-focused": {
                            backgroundColor: colors.primary[700],
                        }
                    }
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search company or symbol..."
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: colors.primary[400],
                        },
                        "& .MuiInputLabel-root": {
                            color: colors.grey[200],
                        },
                        "& .MuiAutocomplete-popupIndicator": {
                            color: colors.grey[100],
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                            color: colors.primary[200],
                        },
                    }}
                />
            )}
        />
    );
}

export default StockSearch;