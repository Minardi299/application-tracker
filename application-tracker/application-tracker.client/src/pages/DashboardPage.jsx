import { SectionCards } from "@/components/section-card"
import {ApplicationsStackedChart} from "@/components/bar-chart"
import { Profile } from "@/components/profile"
import { useQueryClient,useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/interceptor";
export  function DashboardPage(){
    const queryClient = useQueryClient();
    const {data:user} = useQuery({
        queryKey: ["user"],
        queryFn: () => fetchUser(),
        initialData: () => {
            const userData = queryClient.getQueryData(["user"]);
            return userData || JSON.parse(localStorage.getItem("authUser")) || {};
        }
    })
    async function fetchUser() {
        const response = await fetchWithAuth("/api/user",{
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }
        return response.json();
    }

    const applicationData = [
    { month: "January", wishlist: 5, applied: 10, interviewing: 3, accepted: 12, rejected: 6, offered: 2, withdrawn: 1 },
    { month: "February", wishlist: 7, applied: 8, interviewing: 4, accepted: 8, rejected: 10, offered: 1, withdrawn: 0 },
    { month: "March", wishlist: 6, applied: 15, interviewing: 5, accepted: 15, rejected: 3, offered: 3, withdrawn: 2 },
    { month: "April", wishlist: 4, applied: 5, interviewing: 6, accepted: 5, rejected: 12, offered: 4, withdrawn: 3 },
    { month: "May", wishlist: 3, applied: 10, interviewing: 2, accepted: 10, rejected: 7, offered: 5, withdrawn: 1 },
    { month: "June", wishlist: 8, applied: 14, interviewing: 7, accepted: 14, rejected: 6, offered: 2, withdrawn: 0 },
    ]

    return (
        <>
            <h1>this isi the dashboard</h1>
            <div className="flex items-center justify-center mb-4">
                <Profile user={user} />
            </div>
            <div className=" ">

            <SectionCards
            submittedThisMonth={15}
            submittedLastMonth={5}
            interviewingThisMonth={5}
            interviewingLastMonth={9}
            rejectedThisMonth={7}
            rejectedLastMonth={8}
            acceptedThisMonth={9}
            acceptedLastMonth={6}/>
            <ApplicationsStackedChart data={applicationData} />
            </div>
        </>

    )
}