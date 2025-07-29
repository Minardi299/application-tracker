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
  SquareMenu,
  FileUser,
  CloudDownload,
  LayoutDashboard,
  Settings,
  Home,
  ServerCog,
  Folder,
  ChevronsRight,
} from "lucide-react"
export function CommandMenu() {
function triggerShortcut(key, { withMeta = true, withShift = false } = {}) {
  const event = new KeyboardEvent("keydown", {
    key: key,
    bubbles: true,
    ctrlKey: !navigator.platform.includes("Mac") && withMeta,
    metaKey: navigator.platform.includes("Mac") && withMeta,
    shiftKey: withShift,
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
                    <SquareMenu />
                    <span>Open Command Menu</span>
                    <CommandShortcut>Ctrl/⌘+K</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => triggerShortcut("g")}>
                    <Folder />
                    <span>Create a folder</span>
                    <CommandShortcut>Ctrl/⌘+G</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => triggerShortcut("j")}>
                    <FileUser />
                    <span>Create an application</span>
                    <CommandShortcut>Ctrl/⌘+J</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => triggerShortcut("b")}>
                    <ChevronsRight />
                    <span>Close sidebar</span>
                    <CommandShortcut>Ctrl/⌘+B</CommandShortcut>
                </CommandItem>
                
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => triggerShortcut("F1", { withShift: true })}>
                <Home />
                <span>Home</span>
                <CommandShortcut>Ctrl/⌘ + Shift + F1</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => triggerShortcut("F2", { withShift: true })}>
                <LayoutDashboard />
                <span>Dashboard</span>
                <CommandShortcut>Ctrl/⌘ + Shift + F2</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => triggerShortcut("F3", { withShift: true })}>
                <Settings />
                <span>Preferences</span>
                <CommandShortcut>Ctrl/⌘ + Shift + F3</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => triggerShortcut("F4", { withShift: true })}>
                <CloudDownload />
                <span>Templates</span>
                <CommandShortcut>Ctrl/⌘ + Shift + F4</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => triggerShortcut("F5", { withShift: true })}>
                <ServerCog />
                <span>Road map</span>
                <CommandShortcut>Ctrl/⌘ + Shift + F5</CommandShortcut>
            </CommandItem>
            
            </CommandGroup>
        </CommandList>
        </Command>
    )
};