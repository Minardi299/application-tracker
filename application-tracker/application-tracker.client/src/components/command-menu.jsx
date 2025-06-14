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
  LayoutDashboard,
  Settings,
  Home,
  User,
  Folder,
} from "lucide-react"
export function CommandMenu() {
    function triggerShortcut(key, withMeta = true) {
  const event = new KeyboardEvent("keydown", {
    key: key,
    bubbles: true,
    ctrlKey: !navigator.platform.includes("Mac") && withMeta,
    metaKey: navigator.platform.includes("Mac") && withMeta,
  });

  window.dispatchEvent(event);
}
  return ( 
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Actions">
                <CommandItem onSelect={() => triggerShortcut("k")}>
                    <FileUser />
                    <span>Open Command Menu</span>
                    <CommandShortcut>Ctrl/⌘K</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => triggerShortcut("f")}>
                    <Folder />
                    <span>Create a folder</span>
                    <CommandShortcut>⌘F</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => triggerShortcut("j")}>
                    <FileUser />
                    <span>Create an application</span>
                    <CommandShortcut>⌘J</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => triggerShortcut("b")}>
                    <FileUser />
                    <span>Close sidebar</span>
                    <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
                
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => triggerShortcut("F1")}>
                <Home />
                <span>Home</span>
                <CommandShortcut>⌘F1</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => triggerShortcut("F2")}>
                <LayoutDashboard />
                <span>Dashboard</span>
                <CommandShortcut>⌘F2</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => triggerShortcut("F3")}>
                <Settings />
                <span>Preferences</span>
                <CommandShortcut>⌘F3</CommandShortcut>
            </CommandItem>
            </CommandGroup>
        </CommandList>
        </Command>
    )
};