import './App.css';
import {Layout} from "@/components/layout.jsx";
import { Routes, Route } from 'react-router-dom'; 
import { ThemeProvider } from "@/context/theme-provider";
import {SettingPage} from "@/pages/SettingPage.jsx";
import {HomePage} from "@/pages/HomePage.jsx"
import {DashboardPage } from "@/pages/DashboardPage.jsx";
import { AuthProvider } from '@/context/auth-provider'; 
import { LoginPage } from '@/pages/LoginPage.jsx';
import { SignUpPage } from '@/pages/SignUpPage';


function App() {
    

    
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AuthProvider>
                <Routes>
                    {/* Define Layout as a parent route */}
                    <Route path="/" element={<Layout />}>
                        {/* layout is parent and these routes are nested because I want to have the sidebar presented in these routes */}
                        {/* note to self: check outlet react router dom in the future if confused */}
                        <Route index element={<HomePage />} /> {/* Default child route */}
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="settings" element={<SettingPage />} />
                        <Route path="folder/:folderId" element={<div>Folder Page</div>} />
                    </Route>
                    <Route path="/login" element={<LoginPage />} /> 
                    <Route path="/signup" element={<SignUpPage />} />
                    {/* TODO make a proper 404 route later */}
                    <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
            </AuthProvider>
           
        </ThemeProvider>
    );
    
    
}


export default App;