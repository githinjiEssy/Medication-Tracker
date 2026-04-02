import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    // Attempt to fetch the user's profile to validate the token
                    const response = await api.get('auth/profile/');
                    setUser(response.data);
                } catch (err) {
                    console.error("Session expired or invalid");
                    // If the token is invalid or expired, clear local storage and reset user state
                    localStorage.clear();
                    setUser(null);
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const signup = async (userData) => {
        try {
            const response = await api.post('auth/register/', userData);
            
            const { access, refresh, user: newUser } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('current_user', JSON.stringify(newUser));
            
            setUser(newUser);
            navigate('/dashboard');
        } catch (err) {
            throw err.response?.data || { message: 'Signup failed' };
        }
    };

    const login = async (username, password) => {
        try {
            const response = await api.post('auth/login/', { username, password });
            
            const { access, refresh, user: loggedInUser } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('current_user', JSON.stringify(loggedInUser));
            
            setUser(loggedInUser);
            navigate('/dashboard');
        } catch (err) {
            throw err.response?.data || { message: 'Login failed' };
        }
    };

    const logout = async () => {
        const refresh = localStorage.getItem('refresh_token');
        try {
            // Standard JWT logout requires blacklisting the refresh token
            if (refresh) {
                await api.post('auth/logout/', { refresh });
            }
        } catch (err) {
            console.warn("Logout request failed, but clearing local state.");
        } finally {
            localStorage.clear();
            setUser(null);
            navigate('/login');
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await api.patch('auth/profile/', profileData); 
            // Based on your README, the PATCH response returns { user, message }
            const updatedUser = response.data.user;
        
            setUser(updatedUser); 
            localStorage.setItem('current_user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (err) {
            throw err.response?.data || { message: 'Update failed' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, loading, updateProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};