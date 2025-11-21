import { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Avatar,
    Paper,
    Divider,
    Snackbar,
    Alert,
    useTheme,
    CircularProgress,
} from "@mui/material";
import {Formik} from "formik";
import * as yup from "yup"
import {useMediaQuery} from "@mui/material";
import Header from "../../components/Header.tsx";
import { tokens } from "../../themes.tsx";
import {getUserProfile} from "../../api/portfolioApi.tsx";
import api from "../../api/axiosConfig.ts";


interface UserFormValues {
    name: string;
    lastName: string;
    email: string;
}

const userSchema = yup.object().shape({
    name: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
});

const ProfileForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [initialValues, setInitialValues] = useState<UserFormValues>({
        name: "",
        lastName: "",
        email: "",
    })

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error"
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const userData = await getUserProfile();
                setInitialValues({
                    ...userData,
                })
                setError(null)
            } catch (error) {
                console.error("Error fetching profile:", error);
                setError("Failed to load user data");
            } finally {
                setLoading(false);
            }
        }

        fetchUserProfile();
    }, []);


    const handleFormSubmit = async (values: UserFormValues) => {
        try {
            await api.patch("/auth/profile/", {
                name: values.name,
                lastName: values.lastName,
            })

            setSnackbar({
                open: true,
                message: "Profile updated successfully!",
                severity: "success"
            })

            setInitialValues(prev => ({...prev, ...values}))

        } catch (error) {
            console.error("Error updating profile:", error);
            setSnackbar({
                open: true,
                message: "Failed to update profile.",
                severity: "error"
            });
        }
    }

    const handleCloseSnackbar = () => {
        setSnackbar({...snackbar, open: false});
    }

    // Helper do inicjałów
    const getInitials = (name: string, lastName: string) => {
        if (!name && !lastName) return "U";
        return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    return (
        <Box m="20px">
            <Header title="User Profile" subtitle="Manage your personal information" />

            <Box display="flex" flexDirection={isNonMobile ? "row" : "column"} gap="30px">

                {/* SEKCJA 1: WIZYTÓWKA (LEWA STRONA) */}
                <Paper
                    elevation={3}
                    sx={{
                        flex: 1,
                        backgroundColor: colors.primary[400],
                        p: "30px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderRadius: "15px",
                        height: "fit-content"
                    }}
                >
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            bgcolor: colors.greenAccent[500],
                            fontSize: "2.5rem",
                            mb: 2
                        }}
                    >
                        {getInitials(initialValues.name, initialValues.lastName)}
                    </Avatar>

                    <Typography variant="h3" color="text.primary" fontWeight="bold">
                        {initialValues.name} {initialValues.lastName}
                    </Typography>
                    <Typography variant="h6" color={colors.greenAccent[500]}>
                        Investor
                    </Typography>

                    <Divider sx={{ width: "100%", my: 3, backgroundColor: colors.grey[700] }} />

                    <Box width="100%">
                        <Typography variant="body1" color="text.primary" mb={1}>
                            <strong>Email:</strong> {initialValues.email}
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                            <strong>Account Status:</strong> Premium
                        </Typography>
                    </Box>
                </Paper>

                {/* SEKCJA 2: FORMULARZ (PRAWA STRONA) */}
                <Paper
                    elevation={3}
                    sx={{
                        flex: 2,
                        backgroundColor: colors.primary[400],
                        p: "30px",
                        borderRadius: "15px"
                    }}
                >
                    <Formik
                        onSubmit={handleFormSubmit}
                        initialValues={initialValues}
                        validationSchema={userSchema}
                        enableReinitialize={true} // KLUCZOWE: Pozwala zaktualizować formularz po pobraniu danych
                    >
                        {({
                              values,
                              errors,
                              touched,
                              handleBlur,
                              handleChange,
                              handleSubmit,
                              dirty // Czy formularz został zmieniony?
                          }) => (
                            <form onSubmit={handleSubmit}>
                                <Box
                                    display="grid"
                                    gap="30px"
                                    gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                                    sx={{
                                        "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="First Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.name}
                                        name="name" // Ważne: musi pasować do klucza w initialValues
                                        error={!!touched.name && !!errors.name}
                                        helperText={touched.name && errors.name}
                                        sx={{ gridColumn: "span 1" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Last Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.lastName}
                                        name="lastName"
                                        error={!!touched.lastName && !!errors.lastName}
                                        helperText={touched.lastName && errors.lastName}
                                        sx={{ gridColumn: "span 1" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="email"
                                        label="Email Address"
                                        value={values.email}
                                        name="email"
                                        disabled={true} // ZABLOKOWANA EDYCJA
                                        helperText="Email cannot be changed."
                                        sx={{
                                            gridColumn: "span 2",
                                            "& .MuiInputBase-input.Mui-disabled": {
                                                WebkitTextFillColor: colors.grey[100], // Żeby tekst był czytelny mimo disabled
                                            }
                                        }}
                                    />
                                </Box>

                                <Box display="flex" justifyContent="end" mt="30px">
                                    <Button
                                        type="submit"
                                        color="secondary"
                                        variant="contained"
                                        size="large"
                                        disabled={!dirty} // Przycisk aktywny tylko gdy są zmiany
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Paper>
            </Box>

            {/* Alert błędu ładowania danych */}
            <Box display="flex" justifyContent="center">
                {error && (
                    <Alert severity="error" sx={{ mt: 5, mb: 2, width: "25%" }}>
                        {error}
                    </Alert>
                )}
            </Box>

            {/* Powiadomienia */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ProfileForm;