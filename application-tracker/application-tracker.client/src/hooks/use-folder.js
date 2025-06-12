import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-provider"; 

export const useFolders = () => {
    const { isLogin } = useAuth();
    
  return useQuery({
    queryKey: ["userFolders"],
    queryFn: fetchFolders,
    enabled: !!isLogin,

  });
};

async function fetchFolders() {
  const response = await fetch('/api/folder', {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch folders data');
  }

  return response.json();
}

export const useFolder = (id) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["userFolder", id],
    queryFn: () => fetchFolderById(id),
    enabled: !!id, 
    initialData: () => {
        const allFolders = queryClient.getQueryData(["userFolders"]);
        return allFolders?.find((f) => f.id === id);
    },
  });
};

export const prefetchFolder = async (queryClient, id) => {
    const existing = queryClient.getQueryData(["userFolder", id]);
  if (!existing) {
    await queryClient.prefetchQuery({
        queryKey: ["userFolder", id],
        queryFn: () => fetchFolderById(id),
    });
}
};

export async function fetchFolderById(folderId) {
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