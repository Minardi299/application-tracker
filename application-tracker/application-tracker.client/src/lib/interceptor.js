
let isRefreshing = false;
let pendingRequests = [];

function retryPendingRequests() {
  pendingRequests.forEach(callback => callback());
  pendingRequests = [];
}

export async function fetchWithAuth(input, init,retryAttempted = false) {
  const originalRequest = { ...init, credentials: 'include' };
  const doFetch = () => fetch(input, originalRequest);

  let response = await doFetch();
  if (response.status !== 401 || retryAttempted) return response;

  // Handle 401: try refresh
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });


      if (!refreshResponse.ok) throw new Error('Refresh failed');

      retryPendingRequests();
    } catch (err) {
      pendingRequests = [];
      throw err;
    }
    finally {
      isRefreshing = false;
    }
  }

  // Wait for the refresh to complete before retrying
  else {
    await new Promise(resolve => {
      pendingRequests.push(resolve);
    });
  }

  return fetchWithAuth(input, init, true);
}
