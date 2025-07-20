import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { AuthService } from '../services/auth-service';
import type { User } from '../types';

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const userData = await AuthService.verifyToken(storedToken);
                    setUser(userData);
                    setToken(storedToken);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("Token verification failed:", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { user: userData, token: newToken } = await AuthService.login(email, password);
            setUser(userData);
            setToken(newToken);
            setIsAuthenticated(true);
            localStorage.setItem('token', newToken);
        } catch (error) {
            setIsAuthenticated(false);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}