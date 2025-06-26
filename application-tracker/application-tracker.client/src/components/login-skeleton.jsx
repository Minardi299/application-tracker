import {Spinner} from "@/components/ui/spinner"
import { UserRound } from "lucide-react";
export function LoginSkeleton() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-6">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 rounded-full bg-muted animate-pulse" />

        <div className="absolute inset-0 flex items-center justify-center">
          <UserRound className="h-8 w-8 text-muted-foreground" />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">Logging you in…</p>
          <Spinner className="h-6 w-6 text-primary" />
    </div>
  );

}
