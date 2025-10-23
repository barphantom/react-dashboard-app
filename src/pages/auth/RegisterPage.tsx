import React from "react";
import {Box, TextField, Button, Typography} from '@mui/material';
import image from '../../assets/images/Register-Image.svg'
import {Formik, Form, Field, ErrorMessage, type FormikHelpers} from "formik";
import * as Yup from 'yup';
// import api from "../../api/axiosConfig.ts";
import {register} from "../../api/auth.ts";

interface RegisterFormValues {
    name: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const RegisterSchema: Yup.Schema<RegisterFormValues> = Yup.object().shape({
    name: Yup.string()
        .required('Name is required'),
    lastName: Yup.string()
        .required('Last name is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(4, 'Must be at least 4 characters long')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match')
        .required('Password is required'),
});

const RegisterPage: React.FC = () => {

    const handleSubmit = async (
        values: RegisterFormValues,
        {setSubmitting}: FormikHelpers<RegisterFormValues>
    ) => {
        try {
            // const response = await api.post("auth/register/", {
            //     name: values.name,
            //     lastName: values.lastName,
            //     email: values.email,
            //     password: values.password,
            //     confirm_password: values.confirmPassword,
            // })
            // console.log("✅ Registration successful:", response.data);
            //
            // localStorage.setItem("accessToken", response.data.access)
            // localStorage.setItem("refreshToken", response.data.refresh)
            // localStorage.setItem("user", JSON.stringify(response.data.user))
            await register(values.name, values.lastName, values.email, values.password, values.confirmPassword);
            window.location.href = "/"
        } catch (error: any) {
            console.error("❌ Registration error:", error);
            if (error.response?.data) {
                const data = error.response.data;
                const errorMessages = Object.values(data)
                    .flat()
                    .join("\n");
                alert(errorMessages);
            } else {
                alert("Something went wrong during registration.");
            }
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
                    Create an account
                </Typography>
                <Typography variant="h5" textAlign="center" mb={4}>
                   Already have an account? {' '}
                    <a href="/login" style={{ color: '#1976d2'}}>
                        Sign in
                    </a>
                </Typography>
                <Formik<RegisterFormValues>
                    initialValues={{ name: '', lastName: '', email: '', password: '', confirmPassword: ''}}
                    validationSchema={RegisterSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form>
                            <Box display="flex" gap={2}>
                                <Field
                                    as={TextField}
                                    name="name"
                                    label="Name"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={<ErrorMessage name="name" />}
                                />

                                <Field
                                    as={TextField}
                                    name="lastName"
                                    label="Last Name"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    error={touched.lastName && Boolean(errors.lastName)}
                                    helperText={<ErrorMessage name="lastName" />}
                                />
                            </Box>

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

                            <Field
                                as={TextField}
                                name="confirmPassword"
                                label="Confirm password"
                                type="password"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                helperText={<ErrorMessage name="confirmPassword" />}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{mt: 3}}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Registering...' : 'Sign Up'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    )
}

export default RegisterPage;