import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-provider"; 
import { fetchWithAuth } from "@/lib/interceptor";

export const useFolders = () => {
    const { isLogin } = useAuth();
    const queryClient = useQueryClient();
    
  return useQuery({
    queryKey: ["userFolders"],
    queryFn: fetchFolders,
    enabled: !!isLogin,
    initialData: () => {
      const folders = queryClient.getQueryData(["userFolders"]);
      return folders || [];
    },

  });
};
async function fetchCount(){
    const response = await fetchWithAuth('/api/jobapplications/count', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch application count');
    }
    return response.json();
  }
export const useApplicationCount = () => {
  const { isLogin } = useAuth();
  return useQuery({
    queryKey: ["applicationCount"],
    queryFn: fetchCount,
    enabled: !!isLogin,
  });
}
async function fetchFolders() {
  const response = await fetchWithAuth('/api/folder', {
    headers: {
      'Content-Type': 'application/json',
    },
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

export const prefetchApplications = async (queryClient, id) => {
  const folderKey = ["userFolder", id];
  const applicationsKey = ["applications", id];

  const existingFolder = queryClient.getQueryData(folderKey);
  const existingApplications = queryClient.getQueryData(applicationsKey);
    const promises = [];

  if (!existingFolder) {
    promises.push(
      queryClient.prefetchQuery({
        queryKey: folderKey,
        queryFn: () => fetchFolderById(id),
      })
    );
  }

  if (!existingApplications) {
    promises.push(
      queryClient.prefetchQuery({
        queryKey: applicationsKey,
        queryFn: () => fetchApplicationByFolderId(id),
      })
    );
  }

  await Promise.all(promises);
};
export const prefetchAllApplications = async (queryClient) => {
  const applicationsKey = ["applications", "all"];
  const existingApplications = queryClient.getQueryData(applicationsKey);

  if (!existingApplications) {
    await queryClient.prefetchQuery({
      queryKey: applicationsKey,
      queryFn: fetchAllApplications,
    });
  }
}
export async function fetchAllApplications() {
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

export async function fetchFolderById(folderId) {
    const response = await fetchWithAuth(`/api/folder/${folderId}`, {
        headers: {
        'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch folder data');
    }

    return response.json();
}
export async function fetchApplicationByFolderId(folderId) {
    const response = await fetchWithAuth(`/api/jobapplications/folder/${folderId}`, {
        headers: {
        'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch folder's application`);
    }

    return response.json();
}
function getLast12Months() {
  const months = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const label = d.toLocaleString("default", { month: "long" });
    months.push({ year, month, label });
  }

  return months;
}

async function fetchApplicationStats(year, month) {
  const response = await fetchWithAuth(`/api/jobapplications/stats?month=${year}-${month}`);
  if (!response.ok) throw new Error("Failed to fetch application data");
  const data = await response.json();

  return {
    ...data,
    month: new Date(year, parseInt(month) - 1).toLocaleString("default", { month: "long" }),
  };
}

export function useApplicationStatsLast12Months() {
  const queryClient = useQueryClient();
  const months = getLast12Months();
  const { isLogin } = useAuth();

  return useQuery({
    queryKey: ["applicationStats", "last12Months"],
    queryFn: async () => {
      return Promise.all(
        months.map(({ year, month }) =>
          queryClient.fetchQuery({
            queryKey: ["applicationStats", `${year}-${month}`],
            queryFn: () => fetchApplicationStats(year, month),
          })
        )
      );
    },
    enabled: !!isLogin,
    initialData: () => {
      const existingData = queryClient.getQueryData(["applicationStats", "last12Months"]);
      return existingData || [];
    },
  });
}