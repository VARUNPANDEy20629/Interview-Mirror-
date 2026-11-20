import { createContext, useContext, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

// NOTE: the production design stores the JWT in an httpOnly cookie set by the backend.
// Only the non-sensitive profile is kept here so the UI can render the user's name.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('im_user')); } catch { return null; }
  });

  const save = (u) => { setUser(u); localStorage.setItem('im_user', JSON.stringify(u)); };

  const login = async (email, password) => save(await api.login(email, password));
  const register = async (name, email, password) => save(await api.register(name, email, password));
  const logout = () => { setUser(null); localStorage.removeItem('im_user'); };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
