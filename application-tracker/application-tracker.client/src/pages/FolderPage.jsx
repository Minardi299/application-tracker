import { useParams } from "react-router-dom";
import { DataTable } from "@/components/DataTable";
import { useFolder } from "@/hooks/use-folder";
import {ApplicationColumn, ApplicationColumnConfig } from "@/components/application-column";
export function FolderPage() {
    const { folderId } = useParams();
   
    const {
        data: folder,
        isLoading,
        isError,
        error,
    } = useFolder(folderId);

  return (
    <div>
      <h1>{folder.name}</h1>
      <p>Folder ID: {folderId}</p>
      <DataTable
        data={folder?.applications || []}
        isLoading={isLoading}
        isError={isError}
        error={error}
        columnDef= {ApplicationColumn}
        filterColumnConfig={ApplicationColumnConfig}
    />
    </div>
  );
}