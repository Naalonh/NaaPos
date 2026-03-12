import { getToken, logout } from "./auth";

export const apiFetch = async (url, options = {}) => {
  const token = getToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    logout();
    return;
  }

  return response;
};
