import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

function normalizeUser(data) {
  if (!data) return null;

  return {
    ...data,
    id: data.id || data._id,
    profilePhoto: data.profilePhoto || data.profile || '',
    about: data.about || data.bio || '',
  };
}

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '/api';

async function authRequest(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  let payload = null;

  if (contentType.includes('application/json')) {
    payload = await response.json();
  } else {
    payload = await response.text();
  }

  if (!response.ok) {
    throw new Error(payload?.message || 'Request failed');
  }

  return payload;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrapAuth() {
      try {
        const response = await authRequest('/auth/me');
        setUser(normalizeUser(response?.data || null));
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    bootstrapAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setUser(normalizeUser(response?.data || null));
      return { success: true, data: response?.data || null };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await authRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      setUser(normalizeUser(response?.data || null));
      return { success: true, data: response?.data || null };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateUser = async (updatedData) => {
    if (!user?.id) {
      return { success: false, message: 'Not authenticated' };
    }

    try {
      const response = await authRequest(`/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedData),
      });

      const updatedUser = normalizeUser(response?.data || null);
      setUser(updatedUser);
      return { success: true, data: updatedUser };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await authRequest('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore logout failures and clear client state anyway
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}