import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

interface user {
  id: number;
  image: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: user | null;
  login: (token: string, user: user) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<user | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    const storedUser = Cookies.get("user");
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (token: string, user: user) => {
    Cookies.set("token", token, { expires: 2 });
    Cookies.set("user", JSON.stringify(user), { expires: 2 });
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
