import { ColorModeContext, useMode } from "./themes"
import { CssBaseline, ThemeProvider } from "@mui/material"
import {Routes, Route} from "react-router-dom";
import Topbar from "./pages/global/Topbar.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import Sidebar from "./pages/global/Sidebar.tsx"
import Team from "./pages/team/index.tsx"
import Invoices from "./pages/invoices/index.tsx"
import Contacts from "./pages/contacts/index.tsx"
import Form from "./pages/form/index.tsx"
import Calendar from "./pages/calendar/index.tsx"
// import Bar from "./pages/global/Bar.tsx"
// import Line from "./pages/global/Line.tsx"
// import Pie from "./pages/global/Pie.tsx"
// import FAQ from "./pages/global/FAQ.tsx"
// import Geography from "./pages/global/Geography.tsx"


function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
                <div className='app'>
                    <Sidebar />
                    <main className="content">
                        <Topbar />
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/eq" element={<Dashboard />} />
                            <Route path="/team" element={<Team />} />
                            <Route path="/contacts" element={<Contacts />} />
                            <Route path="/invoices" element={<Invoices />} />
                            <Route path="/form" element={<Form />} />
                            <Route path="/calendar" element={<Calendar />} />
                            {/*<Route path="/bar" element={<Bar />} />*/}
                            {/*<Route path="/pie" element={<Pie />} />*/}
                            {/*<Route path="/line" element={<Line />} />*/}
                            {/*<Route path="/faq" element={<FAQ />} />*/}
                            {/*<Route path="/geography" element={<Geography />} />*/}
                        </Routes>

                    </main>
                </div>
        </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
