import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/DataTable";

export function FolderPage() {
    const { folderId } = useParams();
    async function fetchFolder(folderId) {
        const response = await fetch(`/api/folder/${folderId}`, {
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch folder data');
        }

        return response.json();
    }
    const {
        data: folder,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['folder', folderId],
        queryFn: () => fetchFolder(folderId),
        enabled: !!folderId, 
    });

  return (
    <div>
      <h1>Folder Page</h1>
      <p>Folder ID: {folderId}</p>
    </div>
  );
}