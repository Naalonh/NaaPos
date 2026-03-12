export const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/login";
};
