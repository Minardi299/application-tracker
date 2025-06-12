import { useParams } from "react-router-dom";
import { DataTable } from "@/components/DataTable";
import { useQuery } from "@tanstack/react-query";
import { useFolder } from "@/hooks/use-folder";
import {ApplicationColumn, ApplicationColumnConfig } from "@/components/application-column";
export function FolderPage() {
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