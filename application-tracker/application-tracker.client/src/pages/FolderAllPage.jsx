import { DataTable } from "@/components/DataTable";
import { useQuery } from "@tanstack/react-query";
import { FolderForm } from "@/components/forms/folder-form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { fetchWithAuth } from "@/lib/interceptor";
import {ApplicationColumn, ApplicationColumnConfig } from "@/components/application-column";
export function FolderAllPage() {
    
    async function fetchApplications() {
        return fetchWithAuth(`/api/jobapplications`, {
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
        queryKey: ["applications", "all"],
        queryFn: () => fetchApplications(),
    });

  return (
    <div >
        <div className="flex items-center align-center">
            <h1>All</h1>
        </div>
     
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