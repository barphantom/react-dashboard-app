import { ColorModeContext, useMode } from "./themes"
import { CssBaseline, ThemeProvider } from "@mui/material"
import {Routes, Route, Navigate} from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import PrivateRoute from "./components/PrivateRoute";

// Public pages
import LoginPage from "./pages/auth/LoginPage.tsx"
import RegisterPage from "./pages/auth/RegisterPage.tsx"

// Private pages
import Dashboard from "./pages/dashboard/Dashboard.tsx";
// import Team from "./pages/team/ProfileForm.tsx"
import Invoices from "./pages/invoices/index.tsx"
import Contacts from "./pages/contacts/index.tsx"
import ProfileForm from "./pages/form/ProfileForm.tsx"
import Calendar from "./pages/calendar/index.tsx"
import FAQ from "./pages/faq/index.tsx"
import Bar from "./pages/bar/index.tsx"
import Pie from "./pages/pie/index.tsx"
import Line from "./pages/line/index.tsx"
// import PortfolioValue from "./pages/line/portfolioValue.tsx";
import MainDashboard from "./pages/dashboard/MainDashboard.tsx";
import StockDetailsPage from "./pages/stockDetails/StockDetailsPage.tsx";
import PortfolioDetails from "./pages/portfolioDetails/PortfolioDetails.tsx";
import PortfolioChartNew from "./components/PortfolioDashboard/PortfolioChartNew.tsx";
import {PortfolioIdProvider} from "./components/context/PortfolioIdProvider.tsx";
import {UserProvider} from "./components/context/UserProvider.tsx";
import RecommendationsPage from "./pages/recommendations/RecommendationsPage.tsx";


function App() {
  const [theme, colorMode] = useMode();

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Private routes */}
                    <Route element={<PrivateRoute />}>
                        <Route element={<PortfolioIdProvider />}>
                            <Route element={<UserProvider />}>
                                <Route element={<AppLayout />}>
                                    <Route path="/" element={<Navigate to="/portfolio-dashboard" replace/>} />
                                    <Route path="/portfolio-dashboard" element={<MainDashboard />} />
                                    <Route path="/stock/:symbol" element={<StockDetailsPage />} />
                                    <Route path="/recommendations" element={<RecommendationsPage />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/team" element={<PortfolioDetails />} />
                                    <Route path="/contacts" element={<Contacts />} />
                                    <Route path="/invoices" element={<Invoices />} />
                                    <Route path="/form" element={<ProfileForm />} />
                                    <Route path="/calendar" element={<Calendar />} />
                                    <Route path="/faq" element={<FAQ />} />
                                    <Route path="/bar" element={<Bar />} />
                                    <Route path="/pie" element={<Pie />} />
                                    <Route path="/line" element={<Line />} />
                                    <Route path="/geography" element={<PortfolioChartNew portfolioId={3} />} />
                                </Route>
                            </Route>
                        </Route>
                    </Route>

                </Routes>
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}


export default App
