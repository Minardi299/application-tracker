import { useEffect, useState } from 'react';
import { Button } from "./components/ui/button.jsx"
import './App.css';

function App() {
    const [forecasts, setForecasts] = useState();
    useEffect(() => {
        populateWeatherData();
    }, []);

    const contents = forecasts === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>name</th>
                    <th>Is completed</th>
                    
                </tr>
            </thead>
            <tbody>
                {forecasts.map(forecast =>
                    <tr key={forecast.id}>
                        <td>{forecast.name}</td>
                        <td>{forecast.isComplete.toString()}</td>
                    </tr>
                  
                )}
            </tbody>
        </table>;

    return (
        <div >
            <div className="">
                <Button>Click me</Button>
            </div>
            <h1 id="tableLabel">Todo</h1>
            <h2>what's up guys hi</h2>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
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