import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"

export function Profile({ user }) {
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
    <Card className="w-full max-w-sm">
      
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




        <div className="flex flex-row items-start text-sm">
          <p className="font-medium">Total applications: {user.totalApplicationCount}</p>
          <p className="text-muted-foreground">Time applying: {timeString}</p>
        </div>
      </CardContent>
    </Card>
  )
}
