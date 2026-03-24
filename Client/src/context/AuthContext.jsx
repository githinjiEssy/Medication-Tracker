import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Check for existing session on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('current_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const signup = async (userData) => {
        try {
            // Map frontend names to backend names 
            const payload = {
                username: userData.username,
                email: userData.email,
                password: userData.password,
                password2: userData.password2, 
                first_name: userData.first_name,
                last_name: userData.last_name,
                phone_number: userData.phone_number,
                date_of_birth: userData.date_of_birth,
                gender: userData.gender === 'Male' ? 'M' : userData.gender === 'Female' ? 'F' : 'O',
            };

            const response = await api.post('register/', payload); // POST to http://127.0.0.1:8000/api/auth/register/
            
            // Save tokens and user data
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('current_user', JSON.stringify(response.data.user));
            
            setUser(response.data.user);
            navigate('/dashboard');
        } catch (err) {
            throw err.response?.data || { message: 'Signup failed' };
        }
    };

    const login = async (username, password) => {
        try {
            const response = await api.post('login/', { username, password }); // POST to http://127.0.0.1:8000/api/auth/login/
            
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('current_user', JSON.stringify(response.data.user));
            
            setUser(response.data.user);
            navigate('/dashboard');
        } catch (err) {
            throw err.response?.data || { message: 'Login failed' };
        }
    };

    const logout = async () => {
        try {
            const refresh = localStorage.getItem('refresh_token');
            // If the access token is dead, this might fail with a 401
            await api.post('logout/', { refresh }); 
        } catch (err) {
            console.warn("Backend logout failed, but clearing local session anyway.");
        } finally {
            // Clear local session regardless of backend response to ensure user is logged out on frontend
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('current_user');
            setUser(null);
            navigate('/login');
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await api.patch('profile/', profileData); 
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