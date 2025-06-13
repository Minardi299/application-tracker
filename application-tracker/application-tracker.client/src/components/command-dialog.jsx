
import { useCommandDialog } from "@/context/command-provider";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Calculator,
  FileUser,
  CreditCard,
  Settings,
  Smile,
  User,
  Folder,
} from "lucide-react"
import { CommandMenu } from "@/components/command-menu"
export function GlobalCommandDialog() {
  const { open, setOpen } = useCommandDialog();

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandMenu />
    </CommandDialog>
  );
}