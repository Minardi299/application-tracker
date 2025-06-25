import { SectionCards } from "@/components/section-card"
export  function DashboardPage(){
    return (
        <>
            <h1>this isi the dashboard</h1>
            <SectionCards
            submittedThisMonth={15}
            submittedLastMonth={5}
            interviewingThisMonth={5}
            interviewingLastMonth={9}
            rejectedThisMonth={7}
            rejectedLastMonth={8}
            acceptedThisMonth={9}
            acceptedLastMonth={6}
  />
        </>
    )
}