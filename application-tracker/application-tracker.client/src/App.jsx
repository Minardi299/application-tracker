import './App.css';
import {Layout} from "@/components/layout.jsx";
import { Routes, Route } from 'react-router-dom'; 
import { ThemeProvider } from "@/components/theme-provider";
import {SettingPage} from "@/pages/SettingPage.jsx";
import {HomePage} from "@/pages/HomePage.jsx"
import {DashboardPage } from "@/pages/DashboardPage.jsx";


function App() {
    

    
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Layout>

            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/dashboard" element={<DashboardPage/>} />
                <Route path="/settings" element={<SettingPage/>} />

                {/* Add a catch-all or 404 route*/}
                {/* <Route path="*" element={<NotFoundPage />} />  */}
            </Routes>
               
            </Layout>
        </ThemeProvider>
    );
    
    
}

export default App;