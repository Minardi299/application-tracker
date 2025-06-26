import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
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
      setUserProfilePicture(JSON.parse(storedUrl));
    }
  }, []);

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="flex items-center gap-4 p-4">
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
        <Separator orientation="vertical" className="my-4"  />
        <p>hello</p>
      </CardContent>
    </Card>
  )
}