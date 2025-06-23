import { useParams } from "react-router-dom";
import { DataTable } from "@/components/DataTable";
import { useQuery } from "@tanstack/react-query";
import { useFolder } from "@/hooks/use-folder";
import { useGlobalSheet} from "@/context/sheet-provider";
import { FolderForm } from "@/components/forms/folder-form";
import { Button } from "@/components/ui/button";
import {ApplicationColumn, ApplicationColumnConfig } from "@/components/application-column";
export function FolderPage() {
    const { openSheet } = useGlobalSheet();
    
    const { folderId } = useParams();
    const {data: folder} = useFolder(folderId);
    async function fetchApplications(folderId) {
        return fetch(`/api/jobapplications/folder/${folderId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
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
    <div>
      <h1>{folder?.name || 'Loading...'}</h1>
      <Button 
        onClick={() => {
                            openSheet({
                                    render: () => <FolderForm mode="edit" data={folder} />,
                                    title: `${folder.name}`,
                                    description: `Editing ${folder.id}.`,
                                })
                        }}>Edit</Button>
      <p>Folder ID: {folderId}</p>
      <DataTable
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