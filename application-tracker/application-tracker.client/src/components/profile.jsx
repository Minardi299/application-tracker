import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
export function Profile({ user }) {
    const fullName = `${user.firstName} ${user.lastName}`
  const joinedDate = format(new Date(user.createdAt), "MMMM d, yyyy")

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={user.profilePictureUrl || "/default-avatar.png"}
            alt={user.firstName}
          />
          <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-lg">{fullName}</div>
          <div className="text-sm text-muted-foreground">
            Joined {joinedDate}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}