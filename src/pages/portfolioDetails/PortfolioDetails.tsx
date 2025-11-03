import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { tokens } from "../../themes.tsx";
import Header from "../../components/Header.tsx";
import api from "../../api/axiosConfig.ts";
import { usePortfolio } from "../../components/context/usePortfolio.tsx";
import PortfolioValueChart from "../../components/PortfolioDashboard/PortfolioValueChart.tsx";

interface PortfolioPosition {
    id: number;
    symbol: string;
    name: string;
    quantity: string;
    purchase_price: string;
    purchase_date: string;
    created_at: string;
    updated_at: string;
}

const PortfolioDetails: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { portfolioId } = usePortfolio();

    const [chartRefreshKey, setChartRefreshKey] = useState(0);
    const [positions, setPositions] = useState<PortfolioPosition[]>([]);
    const [loading, setLoading] = useState(true);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<PortfolioPosition | null>(null);
    const [editForm, setEditForm] = useState({
        quantity: "",
        purchase_price: "",
        purchase_date: "",
    });

    // Fetch portfolio positions
    useEffect(() => {
        if (!portfolioId) return;

        const fetchPositions = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/portfolios/${portfolioId}/stocks/`);
                setPositions(response.data);
            } catch (error) {
                console.error("Failed to fetch positions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPositions();
    }, [portfolioId]);

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

            // Refresh positions
            const response = await api.get(`/portfolios/${portfolioId}/stocks/`);
            setPositions(response.data);
            setChartRefreshKey(prevState => prevState + 1)
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
            setPositions(positions.filter(p => p.id !== positionId));
        } catch (error: any) {
            console.error("Failed to delete position:", error);
            alert(error.response?.data?.error || "Failed to delete position");
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
                <Typography ml={2}>Loading portfolio details...</Typography>
            </Box>
        );
    }

    if (!portfolioId) {
        return (
            <Box m="20px">
                <Typography color="error" align="center">
                    No portfolio found for this user.
                </Typography>
            </Box>
        );
    }

    return (
        <Box m="20px">
            <Header title="Portfolio Details" subtitle="Detailed view of your portfolio performance and holdings" />

            {/* Portfolio Value Chart */}
            <Box
                sx={{
                    backgroundColor: colors.primary[400],
                    borderRadius: "1.5rem",
                    p: 3,
                    mb: 3,
                }}
            >
                <Typography variant="h5" mb={2} color={colors.grey[100]}>
                    Portfolio Value History
                </Typography>
                <PortfolioValueChart key={chartRefreshKey} portfolioId={portfolioId} />
            </Box>

            {/* Positions Table */}
            <Box
                sx={{
                    backgroundColor: colors.primary[400],
                    borderRadius: "1.5rem",
                    p: 3,
                }}
            >
                <Typography variant="h5" mb={2} color={colors.grey[100]}>
                    Portfolio Positions
                </Typography>

                {positions.length === 0 ? (
                    <Typography color={colors.grey[300]} align="center" py={3}>
                        No positions in portfolio yet. Add stocks to get started.
                    </Typography>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>Symbol</TableCell>
                                    <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>Name</TableCell>
                                    <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }} align="right">Quantity</TableCell>
                                    <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }} align="right">Purchase Price</TableCell>
                                    <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }} align="right">Purchase Date</TableCell>
                                    <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }} align="right">Total Cost</TableCell>
                                    <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }} align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {positions.map((position) => {
                                    const totalCost = parseFloat(position.quantity) * parseFloat(position.purchase_price);
                                    return (
                                        <TableRow key={position.id} hover>
                                            <TableCell sx={{ color: colors.grey[100], fontWeight: "600" }}>
                                                {position.symbol}
                                            </TableCell>
                                            <TableCell sx={{ color: colors.grey[300] }}>
                                                {position.name || "—"}
                                            </TableCell>
                                            <TableCell sx={{ color: colors.grey[100] }} align="right">
                                                {parseFloat(position.quantity).toFixed(2)}
                                            </TableCell>
                                            <TableCell sx={{ color: colors.grey[100] }} align="right">
                                                ${parseFloat(position.purchase_price).toFixed(2)}
                                            </TableCell>
                                            <TableCell sx={{ color: colors.grey[100] }} align="right">
                                                {position.purchase_date}
                                            </TableCell>
                                            <TableCell sx={{ color: colors.grey[100] }} align="right">
                                                ${totalCost.toFixed(2)}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    onClick={() => handleEditClick(position)}
                                                    sx={{ color: colors.blueAccent[400] }}
                                                    size="small"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDelete(position.id)}
                                                    sx={{ color: "#ff4976" }}
                                                    size="small"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>

            {/* Edit Dialog */}
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

export default PortfolioDetails;