import { useParams } from "react-router-dom";
import { DataTable } from "@/components/DataTable";
import { useQuery } from "@tanstack/react-query";
import { useFolder } from "@/hooks/use-folder";
import { useGlobalSheet} from "@/context/sheet-provider";
import { FolderForm } from "@/components/forms/folder-form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { fetchWithAuth } from "@/lib/interceptor";
import {ApplicationColumn, ApplicationColumnConfig } from "@/components/application-column";
export function FolderPage() {
    const { openSheet } = useGlobalSheet();
    
    const { folderId } = useParams();
    const {data: folder} = useFolder(folderId);
    async function fetchApplications(folderId) {
        return fetchWithAuth(`/api/jobapplications/folder/${folderId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch applications');
            }
            return response.json();
        });
    }
    const {
        data: applications,
        isLoading: isApplicationsLoading,
        isError: isApplicationsError,
        error: applicationsError,
    } = useQuery({
        queryKey: ["applications", folderId],
        queryFn: () => fetchApplications(folderId),
    });

  return (
    <div >
        <div className="flex items-center align-center">
            <h1>{folder?.name || 'Loading...'}</h1>
            <Button 
                className="ml-3"
                variant="outline"
                onClick={() => 
                    {
                        openSheet({
                                render: () => <FolderForm mode="edit" data={folder} />,
                                title: `${folder.name}`,
                                description: `Editing ${folder.id}.`,
                            })
                    }}>  
                    <Pencil/>
            </Button>
        </div>
      <p>Folder ID: {folderId}</p>
      <DataTable
        canExportToCSV={true}
        data={applications || []}
        isLoading={isApplicationsLoading}
        isError={isApplicationsError}
        error={applicationsError}
        columnDef= {ApplicationColumn}
        filterColumnConfig={ApplicationColumnConfig}
    />
    </div>
  );
}