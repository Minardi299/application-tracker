import { useGlobalSheet } from "@/context/sheet-provider";
import { useEffect } from "react";
import { ApplicationForm } from "@/components/forms/application-form";
import { FolderForm } from "@/components/forms/folder-form";

export function EditingSheetShortcuts() {
  const { openSheet } = useGlobalSheet();

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === "j") {
          e.preventDefault();
          openSheet({
            render: () => <ApplicationForm mode="create"/>,
            title: "New Application",
            description: "Track a new job application.",
          });
        }
        if (e.key.toLowerCase() === "f") {
          e.preventDefault();
          openSheet({
            render: () => <FolderForm mode="create" />,
            title: "New Folder",
            description: "Create a new folder for your applications.",
          });
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openSheet]);

  return null;
}