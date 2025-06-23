import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import React from "react";
import { useGlobalSheet } from "@/context/sheet-provider";
export function EditingSheet( ){
    const { isOpen, closeSheet, render, title, description } = useGlobalSheet();

    
    return(
        <Sheet open={isOpen} onOpenChange={closeSheet} modal={false} >
        <SheetContent className="p-4 overflow-y-auto w-[33vw] min-w-[33vw]">
          <SheetHeader>
            <SheetTitle className="truncate leading-normal">{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          {render  ? render(): null}
        </SheetContent>
      </Sheet>
    )
}