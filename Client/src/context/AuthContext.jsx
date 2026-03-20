// temporary fix using local storage
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if a user session exists in storage
        const savedUser = localStorage.getItem('current_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const signup = async (userData) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Save user to "database" (localStorage)
        localStorage.setItem('mock_db_user', JSON.stringify(userData));
        
        // Automatically log them in
        localStorage.setItem('current_user', JSON.stringify(userData));
        setUser(userData);
        navigate('/dashboard');
    };

    const login = async (username, password) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const storedUser = JSON.parse(localStorage.getItem('mock_db_user'));

        if (storedUser && storedUser.username === username && storedUser.password === password) {
            localStorage.setItem('current_user', JSON.stringify(storedUser));
            setUser(storedUser);
            navigate('/dashboard');
        } else {
            throw new Error('Invalid username or password.');
        }
    };

    const logout = () => {
        localStorage.removeItem('current_user');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};