import React, { useState, useEffect } from 'react';
import { authAPI } from './services/api';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import DataBayi from './components/DataBayi';
import Pengukuran from './components/Pengukuran';
import DataPetugas from './components/DataPetugas';
import ReportPage from './components/ReportPage';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('dashboard');

    // Check if user is already logged in
    useEffect(() => {
        const savedUser = authAPI.getCurrentUser();
        const token = localStorage.getItem('posyandu_token');
        
        if (savedUser && token) {
            setCurrentUser(savedUser);
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (user) => {
        // This function receives user data from AuthPage after successful API login
        console.log('handleLogin called with user:', user); // Debug log
        setCurrentUser(user);
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
        console.log('State updated - isAuthenticated:', true); // Debug log
    };

    const handleLogout = () => {
        authAPI.logout();
        setIsAuthenticated(false);
        setCurrentUser(null);
        setCurrentPage('dashboard');
    };

    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    const handleBack = () => {
        setCurrentPage('dashboard');
    };

    if (!isAuthenticated) {
        return <AuthPage onLogin={handleLogin} />;
    }

    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return (
                    <Dashboard 
                        user={currentUser} 
                        onLogout={handleLogout} 
                        onNavigate={handleNavigate} 
                    />
                );
            case 'data-bayi':
                return (
                    <DataBayi 
                        onNavigate={handleNavigate} 
                        onBack={handleBack} 
                    />
                );
            case 'pengukuran':
                return (
                    <Pengukuran 
                        onBack={handleBack} 
                    />
                );
            case 'data-petugas':
                return (
                    <DataPetugas 
                        onBack={handleBack} 
                        currentUser={currentUser} 
                    />
                );
            case 'laporan':
                return (
                    <ReportPage 
                        onBack={handleBack} 
                        currentUser={currentUser}
                    />
                );
            default:
                return (
                    <Dashboard 
                        user={currentUser} 
                        onLogout={handleLogout} 
                        onNavigate={handleNavigate} 
                    />
                );
        }
    };

    return (
        <div className="App">
            {renderCurrentPage()}
        </div>
    );
}

export default App;