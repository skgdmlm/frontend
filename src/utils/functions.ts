
export const handleSetLocalStorage = (name: string, data: string) => {
  localStorage.setItem(name, data);
};

export const getItemLocalStorage = (name: string) => {
  return localStorage.getItem(name);
};

export const deleteItemLocalStorage = (name: string) => {
  localStorage.removeItem(name);
};

export const handleSessionExpire = () => {
  localStorage.clear();
};

export const handleLogout = () => {
  localStorage.clear();
  window.location.replace('/app/login');
};
