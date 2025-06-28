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
    const prevMonthData = applicationData[applicationData.length - 2];

    // Extracted sums for SectionCards props
    const submittedThisMonth = (lastMonthData?.interviewing ?? 0) + (lastMonthData?.offered ?? 0) + (lastMonthData?.accepted ?? 0) + (lastMonthData?.rejected ?? 0) + (lastMonthData?.applied ?? 0);
    const submittedLastMonth = (prevMonthData?.interviewing ?? 0) + (prevMonthData?.offered ?? 0) + (prevMonthData?.accepted ?? 0) + (prevMonthData?.rejected ?? 0) + (prevMonthData?.applied ?? 0);
    const interviewingThisMonth = (lastMonthData?.interviewing ?? 0) + (lastMonthData?.offered ?? 0) + (lastMonthData?.accepted ?? 0);
    const interviewingLastMonth = (prevMonthData?.interviewing ?? 0) + (prevMonthData?.offered ?? 0) + (prevMonthData?.accepted ?? 0);
    const rejectedThisMonth = lastMonthData?.rejected ?? 0;
    const rejectedLastMonth = prevMonthData?.rejected ?? 0;
    const acceptedThisMonth = lastMonthData?.accepted ?? 0;
    const acceptedLastMonth = prevMonthData?.accepted ?? 0;

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
        <div className="w-full">

            <Profile user={user} />
        </div>
        
        <SectionCards
        submittedThisMonth={submittedThisMonth}
        submittedLastMonth={submittedLastMonth}
        interviewingThisMonth={interviewingThisMonth}
        interviewingLastMonth={interviewingLastMonth}
        rejectedThisMonth={rejectedThisMonth}
        rejectedLastMonth={rejectedLastMonth}
        acceptedThisMonth={acceptedThisMonth}
        acceptedLastMonth={acceptedLastMonth}/>
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