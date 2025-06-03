import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button.jsx";
import {ModeToggle} from "@/components/mode-toggle.jsx";
import { useAuth } from '@/context/auth-provider'; 
export  function HomePage(){
    const { token } = useAuth(); 
    const [todos, setTodos] = useState([]);
    const [code, setCode] = useState("");
    // useEffect(() => {
    //     populateTodosData();
    // }, []);
    async function populateTodosData() {
        console.log("Attempting to fetch todos. Token:", token);

        if (!token) {
            console.warn("No auth token found in context. User might not be logged in.");
            
            // navigate('/login');
            // return;
        }
        const headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch('/api/todoitems', {
            method: "GET",
            headers: headers,
        });
        setCode(response.status);
        if (response.ok) {
            const data = await response.json();
            setTodos(data);
        }
    }
    return(
        <>
            <div className="">
                <ModeToggle/>
                <Button onClick={populateTodosData}>Click me</Button>
            </div>
            <h1 id="tableLabel">The table</h1>
            <h2>what's up guys hi</h2>
            <p>This component demonstrates fetching data from the server.</p>
            <p>there's currently {todos.length} todos in the database</p>
            <p>this is the status {code}</p>

        </>
    )
}