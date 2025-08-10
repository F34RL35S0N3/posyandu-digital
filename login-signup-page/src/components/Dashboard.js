import React, { useState, useEffect } from 'react';
import { statisticsAPI, authAPI, handleAPIError } from '../services/api';
import './Dashboard.css';

const Dashboard = ({ user, onLogout, onNavigate }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isVisible, setIsVisible] = useState(false);
    const [stats, setStats] = useState({
        totalBabies: 0,
        totalUsers: 0,
        measurementsToday: 0,
        measurementsThisMonth: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setIsVisible(true);
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        fetchStatistics();
        return () => clearInterval(timer);
    }, []);

    const fetchStatistics = async () => {
        try {
            setIsLoading(true);
            const response = await statisticsAPI.getDashboard();
            
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            const errorMessage = handleAPIError(err);
            setError(errorMessage);
            console.error('Failed to fetch statistics:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogoutClick = () => {
        authAPI.logout();
        onLogout();
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('id-ID');
    };

    const menuItems = [
        { 
            id: 'data-bayi', 
            label: 'Data Bayi', 
            icon: '👶', 
            description: 'Kelola data bayi Posyandu',
            stats: `${stats.totalBabies} bayi terdaftar`
        },
        { 
            id: 'pengukuran', 
            label: 'Pengukuran', 
            icon: '📏', 
            description: 'Lakukan pengukuran real-time',
            stats: `${stats.measurementsToday} pengukuran hari ini`
        },
        { 
            id: 'data-petugas', 
            label: 'Data Petugas', 
            icon: '👥', 
            description: 'Manajemen data petugas',
            stats: `${stats.totalUsers} petugas aktif`
        },
        { 
            id: 'laporan', 
            label: 'Laporan', 
            icon: '📊', 
            description: 'Cetak dan lihat laporan',
            stats: `${stats.measurementsThisMonth} data bulan ini`
        }
    ];

    if (error && !isLoading) {
        return (
            <div className="dashboard-container">
                <div className="error-state">
                    <div className="error-icon">⚠️</div>
                    <h3>Gagal Memuat Dashboard</h3>
                    <p>{error}</p>
                    <button onClick={fetchStatistics} className="retry-button">
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Sidebar Navigation */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-container">
                        <div className="logo-icon">🏥</div>
                        <h2>Posyandu Digital</h2>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-item active" onClick={() => onNavigate('dashboard')}>
                        <span className="nav-icon">🏠</span>
                        <span className="nav-label">Dashboard</span>
                    </div>
                    {menuItems.map((item) => (
                        <div key={item.id} className="nav-item" onClick={() => onNavigate(item.id)}>
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">👤</div>
                        <div className="user-details">
                            <span className="user-name">{user.username}</span>
                            <span className="user-role">Petugas Posyandu</span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogoutClick}>
                        <span>🚪</span>
                        Keluar
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="content-header">
                    <div className="welcome-section">
                        <h1>Selamat Datang, {user.username}!</h1>
                        <p>Dashboard Posyandu Digital - Kelola data bayi dengan mudah</p>
                    </div>
                    <div className="datetime-section">
                        <div className="current-date">{formatDate(currentTime)}</div>
                        <div className="current-time">{formatTime(currentTime)}</div>
                    </div>
                </div>

                <div className={`dashboard-main ${isVisible ? 'visible' : ''}`}>
                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card stat-1">
                            <div className="stat-icon">👶</div>
                            <div className="stat-content">
                                <h3>Total Bayi</h3>
                                <span className="stat-number">{isLoading ? '...' : stats.totalBabies}</span>
                                <span className="stat-change">Terdaftar aktif</span>
                            </div>
                        </div>
                        <div className="stat-card stat-2">
                            <div className="stat-icon">📏</div>
                            <div className="stat-content">
                                <h3>Pengukuran Hari Ini</h3>
                                <span className="stat-number">{isLoading ? '...' : stats.measurementsToday}</span>
                                <span className="stat-change">Tercatat hari ini</span>
                            </div>
                        </div>
                        <div className="stat-card stat-3">
                            <div className="stat-icon">👥</div>
                            <div className="stat-content">
                                <h3>Petugas Aktif</h3>
                                <span className="stat-number">{isLoading ? '...' : stats.totalUsers}</span>
                                <span className="stat-change">Petugas terdaftar</span>
                            </div>
                        </div>
                        <div className="stat-card stat-4">
                            <div className="stat-icon">�</div>
                            <div className="stat-content">
                                <h3>Data Bulan Ini</h3>
                                <span className="stat-number">{isLoading ? '...' : stats.measurementsThisMonth}</span>
                                <span className="stat-change">Total pengukuran</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <h2>Aksi Cepat</h2>
                        <div className="actions-grid">
                            {menuItems.map((item, index) => (
                                <div 
                                    key={item.id} 
                                    className="action-card"
                                    onClick={() => onNavigate(item.id)}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="action-icon">{item.icon}</div>
                                    <h3>{item.label}</h3>
                                    <p>{item.description}</p>
                                    <div className="action-stats">{item.stats}</div>
                                    <div className="action-arrow">→</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="recent-activity">
                        <h2>Aktivitas Terbaru</h2>
                        <div className="activity-list">
                            <div className="activity-item">
                                <div className="activity-icon">➕</div>
                                <div className="activity-content">
                                    <h4>Data Bayi Baru Ditambahkan</h4>
                                    <p>Andi Pratama (ID: B001) telah didaftarkan</p>
                                    <span className="activity-time">5 menit yang lalu</span>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon">📏</div>
                                <div className="activity-content">
                                    <h4>Pengukuran Selesai</h4>
                                    <p>Siti Nurhaliza (ID: B002) - Berat: 7.2kg, Tinggi: 68cm</p>
                                    <span className="activity-time">15 menit yang lalu</span>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon">📄</div>
                                <div className="activity-content">
                                    <h4>Laporan Dicetak</h4>
                                    <p>Laporan perkembangan Muhammad Rizki telah dicetak</p>
                                    <span className="activity-time">1 jam yang lalu</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Posyandu Logo */}
                    <div className="posyandu-logo">
                        <div className="logo-animation">
                            <div className="logo-circle">
                                <div className="logo-inner">
                                    <span className="logo-text">POSYANDU</span>
                                    <span className="logo-subtitle">Digital System</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
