import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
export function FeaturesPage(){
    const [items, setItems] = useState([]);
   

    useEffect(() => {
        const fetchTodoItems = async () => {
            try {
                // Fetch data from the actual API endpoint
                const response = await fetch('/api/todoitems');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setItems(data);

            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        fetchTodoItems();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Filter items based on their completion status
    const comingSoonItems = items.filter(item => !item.isComplete);
    const completedItems = items.filter(item => item.isComplete);
    return(
        <div className="flex flex-col lg:flex-row w-full min-h-screen p-4 md:p-8 gap-8">
            
            {/* Left Container: Coming Soon */}
            <div className="flex-1 flex flex-col  p-6 rounded-2xl border  shadow-lg">
                <h2 className="text-3xl font-bold  mb-6 pb-4 border-b ">
                    Coming Soon
                </h2>
                <div className="space-y-4 overflow-y-auto flex-1 pr-2">

                    {comingSoonItems.length > 0 ? (
                        comingSoonItems.map(item => (
                            <Card key={item.id}>
                                <CardHeader>
                                    <CardTitle>{item.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{item.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full">
                           <p className="">No new features planned right now.</p>
                        </div>
                    )}
                </div>
                    
            </div>


            <div className="flex-1 flex flex-col  p-6 rounded-2xl border shadow-lg">
                <h2 className="text-3xl font-bold  mb-6 pb-4 border-b ">
                    Completed 
                </h2>
                <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                    {completedItems.length > 0 ? (
                        completedItems.map(item => (
                             <Card key={item.id}>
                                <CardHeader>
                                    <CardTitle>{item.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{item.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="">No features have been completed yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}