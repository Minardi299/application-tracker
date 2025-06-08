import { useQuery } from "@tanstack/react-query";

export const useFolders = () => {
  return useQuery({
    queryKey: ["userFolders"],
    queryFn: fetchFolders,
  });
};

async function fetchFolders() {
  const response = await fetch('/api/folders', {
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
  return useQuery({
    queryKey: ["folder", id],
    queryFn: () => fetchFolderById(id),
  });
};

export const prefetchFolder = async (queryClient, id) => {
    const existing = queryClient.getQueryData(["folder", id]);
  if (!existing) {
    await queryClient.prefetchQuery({
        queryKey: ["folder", id],
        queryFn: () => fetchFolderById(id),
    });
}
};

async function fetchFolderById(folderId) {
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