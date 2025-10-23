import React from "react";
import {Box, TextField, Button, Typography} from '@mui/material';
import image from '../../assets/images/Login-Image.svg'
import {Formik, Form, Field, ErrorMessage, type FormikHelpers} from "formik";
import * as Yup from 'yup';
// import api from '../../api/axiosConfig.ts'
import {login} from "../../api/auth.ts";

interface LoginFormValues {
    email: string;
    password: string;
}

const loginSchema: Yup.Schema<LoginFormValues> = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(4, 'Must be at least 4 characters long')
        .required('Password is required')
});

const LoginPage: React.FC = () => {

    const handleSubmit = async (
        values: LoginFormValues,
        {setSubmitting}: FormikHelpers<LoginFormValues>
    ) => {
        try {
            // const response = await api.post("auth/login/", {
            //     email: values.email,
            //     password: values.password,
            // })
            // console.log("Login credentials sent!", response.data)
            //
            // localStorage.setItem("access", response.data.access)
            // localStorage.setItem("refresh", response.data.refresh)
            // localStorage.setItem("user", JSON.stringify(response.data.user))
            await login(values.email, values.password);
            window.location.href = "/"
        } catch (error: any) {
            console.error("❌ Login error:", error);
            alert(
                error.response?.data?.error ||
                error.response?.data?.detail ||
                "Invalid credentials"
            );
        } finally {
            setSubmitting(false)
        }
    };

    return (
        <Box
            height="100vh"
            display="flex"
            backgroundColor="#53105e"
            // backgroundColor="white"
        >
            {/* Lewa część - grafika */}
            <Box
                width="50%"
                boxSizing="border-box"
                padding={6}
            >
                <Box
                    component="img"
                    src={image}
                    alt="Grafika"
                    sx={{
                        height: "100%",
                        width: "100%",
                        flex: 1,
                        objectFit: "cover",
                        borderRadius: "1.5rem",
                    }}
                >
                </Box>
            </Box>

            {/* Prawa część - forms */}
            <Box
                width="50%"
                boxSizing="border-box"
                padding={10}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="h2" fontWeight="bold" textAlign="center" mb={4}>
                    Sign in
                </Typography>
                <Typography variant="h5" textAlign="center" mb={4}>
                    Don't have an account? {' '}
                    <a href="/register" style={{ color: '#1976d2'}}>
                        Sign up
                    </a>
                </Typography>
                <Formik<LoginFormValues>
                    initialValues={{ email: '', password: '' }}
                    validationSchema={loginSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form>
                            <Field
                                as={TextField}
                                name="email"
                                label="Email"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                error={touched.email && Boolean(errors.email)}
                                helperText={<ErrorMessage name="email" />}
                            />

                            <Field
                                as={TextField}
                                name="password"
                                label="Password"
                                type="password"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                error={touched.password && Boolean(errors.password)}
                                helperText={<ErrorMessage name="password" />}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{mt: 3}}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Logging in...' : 'Sign in'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    )
}

export default LoginPage;