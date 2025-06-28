import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from "react"
import { fetchWithAuth } from "@/lib/interceptor";

async function fetchUserRank() {
  const response = await fetchWithAuth('/api/user/rank', {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user rank');
  }

  return response.json();
}
export function Profile({ user }) {
  const {data: rank} = useQuery({
    queryKey: ["userRank"],
    queryFn: () => fetchUserRank(),
  });
  function formatOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

  const fullName = `${user.firstName} ${user.lastName}`
  const joinedDate = format(new Date(user.createdAt), "MMMM d, yyyy")
  const [userProfilePicture, setUserProfilePicture] = useState("");

  useEffect(() => {
    const storedUrl = localStorage.getItem("pfpURL");
    if (storedUrl) {
      setUserProfilePicture(storedUrl);
    }
  }, []);
  

  const estimatedTimeSpent = user.totalApplicationCount * 105;
  const date = new Date(0);
  date.setSeconds(estimatedTimeSpent);
  const timeString = date.toISOString().substring(11, 19);

  return (
    <Card className="w-full ">
      
      <CardContent className="flex flex-row items-center justify-between p-4">
       
        <div className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={userProfilePicture}
              alt={user.firstName}
              referrerPolicy="no-referrer"
            />
            <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-lg">{fullName}</div>
            <div className="text-sm text-muted-foreground">
              Joined {joinedDate}
            </div>
          </div>
        </div>




          <p >Total applications: <b>{user.totalApplicationCount}</b></p>
          <p >All time leaderboard: <b>{formatOrdinal(rank)}</b></p>
          <p >Time applying: <b>{timeString}</b></p>
      </CardContent>
    </Card>
  )
}
