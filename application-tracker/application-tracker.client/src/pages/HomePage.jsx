import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button.jsx";
import {ModeToggle} from "@/components/mode-toggle.jsx";
export  function HomePage(){
    const [todos, setTodos] = useState([]);
    useEffect(() => {
        populateTodosData();
    }, []);
    async function populateTodosData() {
        const response = await fetch('/api/todoitems', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const data = await response.json();
            setTodos(data);
        }
    }
    return(
        <>
            <div className="">
                <ModeToggle/>
                <Button>Click me</Button>
            </div>
            <h1 id="tableLabel">The table</h1>
            <h2>what's up guys hi</h2>
            <p>This component demonstrates fetching data from the server.</p>
            <p>there's currently {todos.length} todos in the database</p>

        </>
    )
}