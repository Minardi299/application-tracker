import * as React from "react"

import { cn } from "@/lib/utils"

function InlineInput({
  className,
  type,
  header = false,
  ...props
}) {
  return (
    <input
    
      autoFocus={false}
      type={type}
      data-slot="input"
      className={cn(
        "w-full  border-none outline-none rounded-sm hover:bg-sidebar-accent p-1.5",
          "focus:ring-0 focus:outline-none focus-visible:ring-0",
          "transition-colors duration-150",
          header && "text-[1.875rem] leading-none font-bold ",
        className
      )}
      {...props} />
  );
}

export { InlineInput }
