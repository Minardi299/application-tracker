import { CalendarIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@Github</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-4">
          <Avatar>
            <AvatarImage src="https://avatars.githubusercontent.com/u/73045615?v=4&size=64" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@Github</h4>
            <p className="text-sm">
              The Github repo for this project.
            </p>
            <div className="text-muted-foreground text-xs">
              MIT License
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
