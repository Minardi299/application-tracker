import { SectionCards } from "@/components/section-card"
import {ApplicationsStackedChart} from "@/components/chart-bar"
import { Profile } from "@/components/profile"
import { useQueryClient,useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/interceptor";
import { ChartRadarDefault } from "@/components/chart-radar";
import {useApplicationStatsLast12Months} from "@/hooks/use-folder";
import { ChartAreaInteractive } from "@/components/chart-area";
export  function DashboardPage(){
    const queryClient = useQueryClient();
    const {data:user} = useQuery({
        queryKey: ["user"],
        queryFn: () => fetchUser(),
        initialData: () => {
            const userData = queryClient.getQueryData(["user"]);
            return userData || JSON.parse(localStorage.getItem("authUser")) || {};
        }
    });
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

    const {data:applicationData} = useApplicationStatsLast12Months();
    const lastMonthData = applicationData[applicationData.length - 1];

    const radarData = [
        //{ category: "Wishlist", value: lastMonthData?.wishlist},
        { category: "Applied", value: lastMonthData?.applied},
        { category: "Interviewing", value: lastMonthData?.interviewing},
        { category: "Offered", value: lastMonthData?.offered},
        { category: "Accepted", value: lastMonthData?.accepted},
        { category: "Rejected", value: lastMonthData?.rejected},
        //{ category: "Withdrawn", value: lastMonthData?.withdrawn},
    ];


    return (
    <div className="flex flex-col  justify-center w-full h-full gap-4 p-4">

            <Profile user={user} />
        
        <SectionCards
        submittedThisMonth={applicationData[applicationData.length - 1]?.interviewing + applicationData[applicationData.length - 1]?.offered + applicationData[applicationData.length - 1]?.accepted + applicationData[applicationData.length - 1]?.rejected + applicationData[applicationData.length - 1]?.applied}
        submittedLastMonth={applicationData[applicationData.length - 2]?.interviewing + applicationData[applicationData.length - 2]?.offered + applicationData[applicationData.length - 2]?.accepted + applicationData[applicationData.length - 2]?.rejected + applicationData[applicationData.length - 2]?.applied}
        interviewingThisMonth={applicationData[applicationData.length - 1]?.interviewing + applicationData[applicationData.length - 1]?.offered + applicationData[applicationData.length - 1]?.accepted}
        interviewingLastMonth={applicationData[applicationData.length - 2]?.interviewing + applicationData[applicationData.length - 2]?.offered + applicationData[applicationData.length - 2]?.accepted}
        rejectedThisMonth={applicationData[applicationData.length - 1]?.rejected}
        rejectedLastMonth={applicationData[applicationData.length - 2]?.rejected}
        acceptedThisMonth={applicationData[applicationData.length - 1]?.accepted}
        acceptedLastMonth={applicationData[applicationData.length - 2]?.accepted}/>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2  ">


           
                <ApplicationsStackedChart 
                    data={applicationData} 
                    startMonth={applicationData[0]?.month}
                    endMonth={applicationData[applicationData.length - 1]?.month}
                />
            
            
                <ChartRadarDefault 
                    data={radarData}
                    endMonth={applicationData[applicationData.length - 1]?.month}
                />

        </div>
        {/* <ChartAreaInteractive/> */}
    </div>
    )
}