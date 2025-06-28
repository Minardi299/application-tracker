import { InlineInput } from "@/components/ui/inline-input";
import { useState } from "react";
export function ResourcePage() {
    const [nom, setNom] = useState("Joe");
    // const templates=[
    //     {content:""}
    // ];
    return (
        <div className="flex flex-col  justify-center items-center p-6">
            <h1>Resource Page</h1>
            <InlineInput placeholder="Name" defaultValue={nom} className="w-28" onChange={setNom} />
        </div>
    );
}