import {  useState } from 'react';
import { Button } from "@/components/ui/button.jsx";
import { CommandMenu } from '@/components/command-menu';
import { fetchWithAuth } from '@/lib/interceptor.js';
export  function HomePage(){
    const [code, setCode] = useState("");
    
    async function populateTodosData() {
        
        const response = await fetchWithAuth('/api/test', {
            method: "GET",
            headers: {
                "Content-Type": "text/html",
            },
        });
        setCode(response.status);
        
    }
    return(
        <>
        <div className="flex items-center justify-center ">
        <div className="w-3/5 h-1/3  ">

            <CommandMenu />

        </div>
        
      </div>

            
            <Button onClick={populateTodosData}>Click me</Button>
            <h1 id="tableLabel">The table</h1>
            <h2>what's up guys hi</h2>
            <p>This component demonstrates fetching data from the server.</p>
            <p>this is the status {code}</p>

        </>
    )
}