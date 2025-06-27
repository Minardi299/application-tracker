import {  useState } from 'react';
import { CommandMenu } from '@/components/command-menu';
import { fetchWithAuth } from '@/lib/interceptor.js';
import { FolderGrid } from '@/components/folder-grid';
export  function HomePage(){
    // const [code, setCode] = useState("");
    
    // async function populateTodosData() {
        
    //     const response = await fetchWithAuth('/api/test', {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "text/html",
    //         },
    //     });
    //     setCode(response.status);
        
    // }
    return(
        <>
        <div className="flex items-center justify-center ">
        <div className="w-3/5 h-1/3  ">

            <CommandMenu />

        </div>
        
      </div>
       
            
            {/* <Button onClick={populateTodosData}>Click me</Button>

            <p>this is the status {code}</p> */}
            <FolderGrid />
        </>
    )
}