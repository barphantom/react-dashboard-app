import React, { useEffect, useState, useMemo, useRef } from "react";
import {
    Box,
    Typography,
    useTheme,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    CircularProgress,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Tooltip,
    Skeleton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';

import ComputerIcon from '@mui/icons-material/Computer';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';

import { tokens } from "../../themes";
import Header from "../../components/Header";
import api from "../../api/axiosConfig";
import { usePortfolio } from "../../components/context/usePortfolio.tsx";
import { useSearchRef } from "../../components/context/useSearchRef.ts";


interface PortfolioPosition {
    id: number;
    symbol: string;
    name: string;
    quantity: string;
    purchase_price: string;
    purchase_date: string;
    sector?: string;
}

type PriceMap = Record<string, number>;

interface CalculatedPosition extends PortfolioPosition {
    currentPrice: number | null;
    totalValue: number;
    totalCost: number;
    profit: number;
    profitPercent: number;
    isLoadingPrice: boolean;
}

const PortfolioPositions: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { portfolioId } = usePortfolio();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useSearchRef();

    const [positions, setPositions] = useState<PortfolioPosition[]>([]);
    const [prices, setPrices] = useState<PriceMap>({});

    const [loadingPositions, setLoadingPositions] = useState(true);
    const [loadingPrices, setLoadingPrices] = useState(false);

    // Filters & Sorting
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("value_desc");

    // Edit Dialog State
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<PortfolioPosition | null>(null);
    const [editForm, setEditForm] = useState({
        quantity: "",
        purchase_price: "",
        purchase_date: "",
    });


    const fetchPositions = async () => {
        if (!portfolioId) return;
        setLoadingPositions(true);
        try {
            const response = await api.get(`/portfolios/${portfolioId}/stocks/`);
            setPositions(response.data);
            fetchPrices();
        } catch (error) {
            console.error("Failed to fetch positions:", error);
        } finally {
            setLoadingPositions(false);
        }
    };

    const fetchPrices = async () => {
        if (!portfolioId) return;
        setLoadingPrices(true);
        try {
            const response = await api.get(`/portfolio/${portfolioId}/quotes/`);
            setPrices(response.data);
        } catch (error) {
            console.error("Failed to fetch quotes:", error);
        } finally {
            setLoadingPrices(false);
        }
    };

    useEffect(() => {
        fetchPositions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [portfolioId]);


    const processedData = useMemo(() => {
        const calculated = positions.map((pos) => {
            const qty = parseFloat(pos.quantity);
            const buyPrice = parseFloat(pos.purchase_price);

            const currentPrice = prices[pos.symbol] !== undefined ? prices[pos.symbol] : null;
            const effectivePrice = currentPrice ?? buyPrice;

            const totalValue = qty * effectivePrice;
            const totalCost = qty * buyPrice;
            const profit = totalValue - totalCost;

            const profitPercent = totalCost !== 0 ? (profit / totalCost) * 100 : 0;

            return {
                ...pos,
                currentPrice,
                totalValue: currentPrice ? totalValue : 0,
                totalCost,
                profit,
                profitPercent,
                isLoadingPrice: currentPrice === null
            } as CalculatedPosition;
        });

        let filtered = calculated;
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filtered = calculated.filter(pos =>
                pos.symbol.toLowerCase().includes(lowerTerm) ||
                pos.name.toLowerCase().includes(lowerTerm)
            );
        }

        return filtered.sort((a, b) => {
            switch (sortBy) {
                case "value_desc": return b.totalValue - a.totalValue;
                case "value_asc": return a.totalValue - b.totalValue;
                case "return_desc": return b.profitPercent - a.profitPercent;
                case "return_asc": return a.profitPercent - b.profitPercent;
                case "name_asc": return a.symbol.localeCompare(b.symbol);
                default: return 0;
            }
        });

    }, [positions, prices, searchTerm, sortBy]);


    const handleAddPositionClick = () => {
        if (inputRef?.current) {
            inputRef.current.focus();
            inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleEditClick = (position: PortfolioPosition) => {
        setSelectedPosition(position);
        setEditForm({
            quantity: position.quantity,
            purchase_price: position.purchase_price,
            purchase_date: position.purchase_date,
        });
        setEditDialogOpen(true);
    };

    const handleEditSave = async () => {
        if (!selectedPosition || !portfolioId) return;

        try {
            await api.patch(`/portfolios/${portfolioId}/stocks/${selectedPosition.id}/`, {
                quantity: editForm.quantity,
                purchase_price: editForm.purchase_price,
                purchase_date: editForm.purchase_date,
            });

            await fetchPositions();

            setEditDialogOpen(false);
        } catch (error: any) {
            console.error("Failed to update position:", error);
            alert(error.response?.data?.error || "Failed to update position");
        }
    };

    const handleDelete = async (positionId: number) => {
        if (!portfolioId) return;
        if (!window.confirm("Are you sure you want to delete this position?")) return;

        try {
            await api.delete(`/portfolios/${portfolioId}/stocks/${positionId}/`);
            setPositions(prev => prev.filter(p => p.id !== positionId));
        } catch (error: any) {
            console.error("Failed to delete position:", error);
            alert(error.response?.data?.error || "Failed to delete position");
        }
    };

    const getSectorIcon = (sector?: string) => {
        switch(sector?.toLowerCase()) {
            case 'technology': return <ComputerIcon fontSize="small" />;
            case 'automotive': return <DirectionsCarIcon fontSize="small" />;
            case 'healthcare': return <LocalHospitalIcon fontSize="small" />;
            case 'finance': return <AccountBalanceIcon fontSize="small" />;
            default: return <BusinessIcon fontSize="small" />;
        }
    };

    if (loadingPositions) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />;

    return (
        <Box m="20px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Header title="Portfolio Positions" subtitle="Detailed view of your holdings" />

                <Box display="flex" gap={2}>
                    <Button
                        variant="outlined"
                        onClick={fetchPrices}
                        disabled={loadingPrices}
                        startIcon={loadingPrices ? <CircularProgress size={20} /> : <RefreshIcon />}
                        sx={{ color: colors.grey[100], borderColor: colors.grey[100] }}
                    >
                        Refresh Prices
                    </Button>

                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={handleAddPositionClick}
                        sx={{ fontWeight: "bold", padding: "10px 20px" }}
                    >
                        Add Position
                    </Button>
                </Box>
            </Box>

            {/* FILTERS */}
            <Box display="flex" gap={2} mb={3}>
                <TextField
                    inputRef={searchInputRef}
                    variant="outlined"
                    placeholder="Filter positions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    sx={{ backgroundColor: colors.primary[400], borderRadius: "8px" }}
                    InputProps={{
                        startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
                    }}
                />
                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        label="Sort By"
                        sx={{ backgroundColor: colors.primary[400], borderRadius: "8px" }}
                        startAdornment={<InputAdornment position="start"><FilterListIcon /></InputAdornment>}
                    >
                        <MenuItem value="value_desc">Highest Value</MenuItem>
                        <MenuItem value="value_asc">Lowest Value</MenuItem>
                        <MenuItem value="return_desc">Highest Return %</MenuItem>
                        <MenuItem value="return_asc">Lowest Return %</MenuItem>
                        <MenuItem value="name_asc">Symbol (A-Z)</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* TABLE */}
            <Box
                sx={{
                    backgroundColor: colors.primary[400],
                    borderRadius: "1.5rem",
                    p: 3,
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)"
                }}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>Symbol</TableCell>
                                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>Name</TableCell>
                                <TableCell align="right" sx={{ color: colors.grey[100], fontWeight: "bold" }}>Shares</TableCell>
                                <TableCell align="right" sx={{ color: colors.grey[100], fontWeight: "bold" }}>Buy Price</TableCell>
                                <TableCell align="right" sx={{ color: colors.grey[100], fontWeight: "bold" }}>Price</TableCell>
                                <TableCell align="right" sx={{ color: colors.grey[100], fontWeight: "bold" }}>Value</TableCell>
                                <TableCell align="right" sx={{ color: colors.grey[100], fontWeight: "bold" }}>Return</TableCell>
                                <TableCell align="center" sx={{ color: colors.grey[100], fontWeight: "bold" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {processedData.map((row) => {
                                const isProfit = row.profit >= 0;

                                return (
                                    <TableRow key={row.id} hover>
                                        <TableCell sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Tooltip title={row.sector || "Unknown Sector"}>
                                                    <Box color={colors.grey[300]} display="flex">
                                                        {getSectorIcon(row.sector)}
                                                    </Box>
                                                </Tooltip>
                                                {row.symbol}
                                            </Box>
                                        </TableCell>

                                        <TableCell sx={{ color: colors.grey[100] }}>{row.name}</TableCell>
                                        <TableCell align="right">{parseFloat(row.quantity).toLocaleString()}</TableCell>
                                        <TableCell align="right" sx={{ color: colors.grey[300] }}>
                                            ${parseFloat(row.purchase_price).toFixed(2)}
                                        </TableCell>

                                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                            {row.isLoadingPrice ? (
                                                <CircularProgress size={14} thickness={5} />
                                            ) : (
                                                `$${row.currentPrice?.toFixed(2)}`
                                            )}
                                        </TableCell>

                                        <TableCell align="right" sx={{ fontWeight: "bold", color: colors.grey[100] }}>
                                            {row.isLoadingPrice ? (
                                                <Skeleton variant="text" width={60} sx={{ ml: "auto" }} />
                                            ) : (
                                                `$${row.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                            )}
                                        </TableCell>

                                        <TableCell align="right">
                                            {row.isLoadingPrice ? (
                                                <Skeleton variant="rectangular" width={70} height={24} sx={{ ml: "auto", borderRadius: 1 }} />
                                            ) : (
                                                <Box
                                                    bgcolor={isProfit ? "rgba(76, 206, 172, 0.15)" : "rgba(255, 73, 118, 0.15)"}
                                                    p="4px 8px"
                                                    borderRadius="4px"
                                                    display="inline-block"
                                                    color={isProfit ? colors.greenAccent[500] : "#ff4976"}
                                                    fontWeight="bold"
                                                    minWidth="80px"
                                                    textAlign="center"
                                                >
                                                    {isProfit ? "+" : ""}{row.profitPercent.toFixed(2)}%
                                                    <Typography component="span" variant="caption" display="block" color="inherit">
                                                        ({isProfit ? "+" : ""}${row.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })})
                                                    </Typography>
                                                </Box>
                                            )}
                                        </TableCell>

                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditClick(row)}
                                                sx={{ color: colors.blueAccent[400] }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(row.id)}
                                                sx={{ color: "#ff4976" }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* EDIT DIALOG */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: colors.primary[400],
                    }
                }}
            >
                <DialogTitle sx={{ color: colors.grey[100] }}>
                    Edit Position: {selectedPosition?.symbol}
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        label="Quantity"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={editForm.quantity}
                        onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                        sx={{
                            input: { color: colors.grey[100] },
                            label: { color: colors.grey[300] },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: colors.grey[700] },
                                "&:hover fieldset": { borderColor: colors.grey[600] },
                            },
                        }}
                    />
                    <TextField
                        label="Purchase Price"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={editForm.purchase_price}
                        onChange={(e) => setEditForm({ ...editForm, purchase_price: e.target.value })}
                        sx={{
                            input: { color: colors.grey[100] },
                            label: { color: colors.grey[300] },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: colors.grey[700] },
                                "&:hover fieldset": { borderColor: colors.grey[600] },
                            },
                        }}
                    />
                    <TextField
                        label="Purchase Date"
                        type="date"
                        fullWidth
                        margin="normal"
                        value={editForm.purchase_date}
                        onChange={(e) => setEditForm({ ...editForm, purchase_date: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            input: { color: colors.grey[100] },
                            label: { color: colors.grey[300] },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: colors.grey[700] },
                                "&:hover fieldset": { borderColor: colors.grey[600] },
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} sx={{ color: colors.grey[300] }}>
                        Cancel
                    </Button>
                    <Button onClick={handleEditSave} variant="contained" color="success">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PortfolioPositions;