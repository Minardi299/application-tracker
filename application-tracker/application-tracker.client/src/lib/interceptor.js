
let isRefreshing = false;
let pendingRequests = [];

function retryPendingRequests() {
  pendingRequests.forEach(callback => callback());
  pendingRequests = [];
}

export async function fetchWithAuth(input, init) {
  const doFetch = () => fetch(input, { ...init, credentials: 'include' });

  let response = await doFetch();

  if (response.status !== 401) return response;

  // Handle 401: try refresh
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!refreshResponse.ok) throw new Error('Refresh failed');
      isRefreshing = false;
      retryPendingRequests();
    } catch (err) {
      isRefreshing = false;
      window.location.href = '/login'; 
      throw err;
    }
  }

  // Wait for the refresh to complete before retrying
  await new Promise(resolve => {
    pendingRequests.push(resolve);
  });

  // Retry the original request
  return doFetch();
}
