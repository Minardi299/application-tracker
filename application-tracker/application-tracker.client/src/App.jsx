import { useEffect, useState } from 'react';
import { Button } from "./components/ui/button.jsx";
import { Checkbox } from "@/components/ui/checkbox";
import './App.css';
import {Layout} from "@/components/layout.jsx";
import { ThemeProvider } from "@/components/theme-provider";
import {ModeToggle} from "@/components/mode-toggle.jsx";


function App() {
    const [forecasts, setForecasts] = useState();
    useEffect(() => {
        populateWeatherData();
    }, []);

    

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Layout>


                <div className="">
                    <ModeToggle/>
                    <Button>Click me</Button>
                </div>
                <h1 id="tableLabel">The table</h1>
                <h2>what's up guys hi</h2>
                <p>This component demonstrates fetching data from the server.</p>

            </Layout>
        </ThemeProvider>
    );
    
    async function populateWeatherData() {
        const response = await fetch('/api/todoitems', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const data = await response.json();
            setForecasts(data);
        }
    }
}

export default App;