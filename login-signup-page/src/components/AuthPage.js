import React, { useState } from 'react';
import { authAPI, handleAPIError } from '../services/api';
import './AuthPage.css';

function AuthPage({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isLogin) {
                // Login logic
                if (!formData.username || !formData.password) {
                    setError('Username dan password harus diisi');
                    setIsLoading(false);
                    return;
                }

                console.log('Attempting login with:', formData.username); // Debug log
                const response = await authAPI.login(formData.username, formData.password);
                console.log('Login response:', response); // Debug log
                
                if (response.success) {
                    // Save user data and token
                    authAPI.saveUser(response.user, response.token);
                    console.log('Calling onLogin with user:', response.user); // Debug log
                    
                    // Call parent callback
                    onLogin(response.user);
                } else {
                    setError('Login gagal. Silakan coba lagi.');
                }
            } else {
                // Signup logic (placeholder for now)
                if (!formData.username || !formData.password || !formData.confirmPassword) {
                    setError('Semua field harus diisi');
                    setIsLoading(false);
                    return;
                }

                if (formData.password !== formData.confirmPassword) {
                    setError('Password dan konfirmasi password tidak sama');
                    setIsLoading(false);
                    return;
                }

                if (formData.password.length < 6) {
                    setError('Password minimal 6 karakter');
                    setIsLoading(false);
                    return;
                }

                // For now, show message that signup is not implemented
                setError('Fitur registrasi belum tersedia. Hubungi administrator.');
            }
        } catch (err) {
            console.error('Login error:', err); // Debug log
            const errorMessage = handleAPIError(err);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const clearForm = () => {
        setFormData({
            username: '',
            password: '',
            confirmPassword: ''
        });
        setError('');
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        clearForm();
    };

    return (
        <div className="auth-page" style={{
            minHeight: '100vh',
            background: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* Medical Background Animation */}
            <div className="floating-shapes">
                <div className="floating-shape shape-1"></div>
                <div className="floating-shape shape-2"></div>
                <div className="floating-shape shape-3"></div>
                <div className="floating-shape shape-4"></div>
                <div className="floating-shape shape-5"></div>
            </div>

            {/* Main Content */}
            <div className="auth-content" style={{
                width: '100%',
                maxWidth: '1000px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: 'white',
                borderRadius: '15px',
                minHeight: '500px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}>
                {/* Left Side - Medical Branding */}
                <div className="auth-left" style={{
                    background: '#1e40af',
                    color: 'white',
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'center',
                    position: 'relative'
                }}>
                    <div className="medical-status" style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#22c55e',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '10px',
                        fontSize: '12px'
                    }}>
                        🟢 Sistem Aktif
                    </div>
                    
                    <div className="logo-section" style={{
                        marginBottom: '30px'
                    }}>
                        <div className="logo-container" style={{
                            marginBottom: '20px'
                        }}>
                            <div className="logo-icon" style={{
                                position: 'relative',
                                display: 'inline-block',
                                fontSize: '50px',
                                marginBottom: '15px'
                            }}>
                                <div className="logo-heart" style={{
                                    position: 'relative',
                                    zIndex: '1'
                                }}>❤️</div>
                                <div className="logo-plus" style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '20px',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}>+</div>
                            </div>
                        </div>
                        <h1 className="brand-title" style={{
                            fontSize: '32px',
                            marginBottom: '10px',
                            fontWeight: 'bold'
                        }}>Posyandu Digital</h1>
                        <p className="brand-subtitle" style={{
                            fontSize: '16px',
                            opacity: '0.9',
                            lineHeight: '1.5',
                            marginBottom: '20px'
                        }}>
                            Sistem Informasi Manajemen Posyandu untuk Monitoring Kesehatan Bayi dan Balita
                        </p>
                    </div>
                    
                    <div className="features-list" style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '15px',
                        marginBottom: '20px'
                    }}>
                        <div className="feature-item" style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.1)',
                            padding: '10px',
                            borderRadius: '8px',
                            fontSize: '14px'
                        }}>
                            <span className="feature-icon" style={{
                                marginRight: '8px',
                                fontSize: '16px'
                            }}>📊</span>
                            <span>Dashboard Monitoring</span>
                        </div>
                        <div className="feature-item" style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.1)',
                            padding: '10px',
                            borderRadius: '8px',
                            fontSize: '14px'
                        }}>
                            <span className="feature-icon" style={{
                                marginRight: '8px',
                                fontSize: '16px'
                            }}>👶</span>
                            <span>Data Bayi & Balita</span>
                        </div>
                        <div className="feature-item" style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.1)',
                            padding: '10px',
                            borderRadius: '8px',
                            fontSize: '14px'
                        }}>
                            <span className="feature-icon" style={{
                                marginRight: '8px',
                                fontSize: '16px'
                            }}>📏</span>
                            <span>Pencatatan Pengukuran</span>
                        </div>
                        <div className="feature-item" style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.1)',
                            padding: '10px',
                            borderRadius: '8px',
                            fontSize: '14px'
                        }}>
                            <span className="feature-icon" style={{
                                marginRight: '8px',
                                fontSize: '16px'
                            }}>👥</span>
                            <span>Manajemen Petugas</span>
                        </div>
                        <div className="feature-item" style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.1)',
                            padding: '10px',
                            borderRadius: '8px',
                            fontSize: '14px'
                        }}>
                            <span className="feature-icon" style={{
                                marginRight: '8px',
                                fontSize: '16px'
                            }}>📋</span>
                            <span>Laporan Kesehatan</span>
                        </div>
                        <div className="feature-item" style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.1)',
                            padding: '10px',
                            borderRadius: '8px',
                            fontSize: '14px'
                        }}>
                            <span className="feature-icon" style={{
                                marginRight: '8px',
                                fontSize: '16px'
                            }}>🩺</span>
                            <span>Riwayat Pemeriksaan</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Authentication Form */}
                <div className="auth-right" style={{
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div className="auth-form-container" style={{
                        width: '100%',
                        maxWidth: '400px',
                        margin: '0 auto'
                    }}>
                        {/* Medical Avatar */}
                        <div className="avatar-section" style={{
                            textAlign: 'center',
                            marginBottom: '30px'
                        }}>
                            <div className="avatar-container" style={{
                                display: 'inline-block',
                                position: 'relative'
                            }}>
                                <div className="avatar" style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '40px',
                                    color: 'white',
                                    margin: '0 auto',
                                    boxShadow: '0 5px 15px rgba(59, 130, 246, 0.3)'
                                }}>👨‍⚕️</div>
                            </div>
                        </div>

                        {/* Form Header */}
                        <div className="form-header" style={{
                            textAlign: 'center',
                            marginBottom: '30px'
                        }}>
                            <h2 style={{
                                fontSize: '28px',
                                marginBottom: '10px',
                                color: '#1f2937',
                                fontWeight: 'bold'
                            }}>{isLogin ? 'Selamat Datang!' : 'Registrasi Baru'}</h2>
                            <p style={{
                                color: '#6b7280',
                                fontSize: '16px',
                                margin: '0'
                            }}>
                                {isLogin 
                                    ? 'Silakan masuk ke Sistem Posyandu Digital' 
                                    : 'Daftar untuk mengakses sistem'
                                }
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="error-message" style={{
                                background: '#fee2e2',
                                border: '1px solid #fecaca',
                                color: '#dc2626',
                                padding: '12px',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '14px'
                            }}>
                                <span className="error-icon" style={{
                                    marginRight: '8px'
                                }}>⚠️</span>
                                {error}
                            </div>
                        )}

                        {/* Authentication Form */}
                        <form className="auth-form" onSubmit={handleSubmit} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                        }}>
                            <div className="form-group" style={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <label htmlFor="username" style={{
                                    marginBottom: '8px',
                                    color: '#374151',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}>Username Petugas</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    style={{
                                        padding: '12px 16px',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        transition: 'border-color 0.3s',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                    placeholder="Masukkan username anda"
                                    disabled={isLoading}
                                    autoComplete="username"
                                />
                            </div>

                            <div className="form-group" style={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <label htmlFor="password" style={{
                                    marginBottom: '8px',
                                    color: '#374151',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}>Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    style={{
                                        padding: '12px 16px',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        transition: 'border-color 0.3s',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                    placeholder="Masukkan password anda"
                                    disabled={isLoading}
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                />
                            </div>

                            {!isLogin && (
                                <div className="form-group" style={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <label htmlFor="confirmPassword" style={{
                                        marginBottom: '8px',
                                        color: '#374151',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}>Konfirmasi Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        style={{
                                            padding: '12px 16px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            transition: 'border-color 0.3s',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                        placeholder="Ulangi password anda"
                                        disabled={isLoading}
                                        autoComplete="new-password"
                                    />
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className={`auth-button ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                                style={{
                                    background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6, #1e40af)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '14px 20px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    marginTop: '10px'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isLoading) {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isLoading) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="loading-spinner" style={{
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid transparent',
                                            borderTop: '2px solid white',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                        {isLogin ? 'Memproses Login...' : 'Mendaftarkan...'}
                                    </>
                                ) : (
                                    isLogin ? 'Masuk ke Sistem' : 'Daftar Sekarang'
                                )}
                            </button>
                        </form>

                        {/* Toggle Mode */}
                        <div className="toggle-mode">
                            <p>
                                {isLogin ? 'Belum memiliki akun petugas?' : 'Sudah memiliki akun?'}
                                <button 
                                    type="button" 
                                    className="toggle-button" 
                                    onClick={toggleMode}
                                    disabled={isLoading}
                                >
                                    {isLogin ? 'Daftar di sini' : 'Login di sini'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;