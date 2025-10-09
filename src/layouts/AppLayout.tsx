import Sidebar from "../pages/global/Sidebar.tsx"
import Topbar from "../pages/global/Topbar.tsx"
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
    return (
        <div className="app">
            <Sidebar />
            <main className="content">
                <Topbar />
                <Outlet />
            </main>
        </div>
    )
}

export default AppLayout;