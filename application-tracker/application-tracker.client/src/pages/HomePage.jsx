import {  useState } from 'react';
import { Button } from "@/components/ui/button.jsx";
import {ModeToggle} from "@/components/mode-toggle.jsx";
import { CommandMenu } from '@/components/command-menu';
export  function HomePage(){
    const [code, setCode] = useState("");
    
    async function populateTodosData() {
        
        const response = await fetch('/api/test', {
            method: "GET",
            headers: {
                "Content-Type": "text/html",
            },
            credentials: "include",
        });
        setCode(response.status);
        
    }
    return(
        <>
            <CommandMenu class/>
            <div className="">
                <ModeToggle/>
                <Button onClick={populateTodosData}>Click me</Button>
            </div>
            <h1 id="tableLabel">The table</h1>
            <h2>what's up guys hi</h2>
            <p>This component demonstrates fetching data from the server.</p>
            <p>this is the status {code}</p>

        </>
    )
}