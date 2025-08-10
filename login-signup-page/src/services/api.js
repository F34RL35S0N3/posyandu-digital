const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('posyandu_token');
};

// Helper function to make authenticated requests
const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

// Authentication API
export const authAPI = {
    login: async (username, password) => {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    },

    logout: () => {
        localStorage.removeItem('posyandu_token');
        localStorage.removeItem('posyandu_user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('posyandu_user');
        return user ? JSON.parse(user) : null;
    },

    saveUser: (user, token) => {
        localStorage.setItem('posyandu_user', JSON.stringify(user));
        localStorage.setItem('posyandu_token', token);
    }
};

// Users/Petugas API
export const usersAPI = {
    getAll: () => apiRequest('/users'),
    
    create: (userData) => apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
    
    update: (id, userData) => apiRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    }),
    
    delete: (id) => apiRequest(`/users/${id}`, {
        method: 'DELETE',
    })
};

// Babies API
export const babiesAPI = {
    getAll: () => apiRequest('/babies'),
    
    create: (babyData) => apiRequest('/babies', {
        method: 'POST',
        body: JSON.stringify(babyData),
    }),
    
    update: (id, babyData) => apiRequest(`/babies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(babyData),
    }),
    
    delete: (id) => apiRequest(`/babies/${id}`, {
        method: 'DELETE',
    }),
    
    getMeasurements: (babyId) => apiRequest(`/babies/${babyId}/measurements`)
};

// Measurements API
export const measurementsAPI = {
    create: (measurementData) => apiRequest('/measurements', {
        method: 'POST',
        body: JSON.stringify(measurementData),
    })
};

// Statistics API
export const statisticsAPI = {
    getDashboard: () => apiRequest('/statistics')
};

// Health check API
export const healthAPI = {
    check: () => apiRequest('/health')
};

// Utility functions
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const diffTime = Math.abs(today - birth);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
        return `${diffDays} hari`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} bulan`;
    } else {
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        return `${years} tahun ${months} bulan`;
    }
};

export const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'normal':
            return '#10b981';
        case 'kurang':
            return '#f59e0b';
        case 'berlebih':
            return '#ef4444';
        case 'aktif':
            return '#10b981';
        case 'nonaktif':
            return '#6b7280';
        default:
            return '#6b7280';
    }
};

// Error handler
export const handleAPIError = (error) => {
    console.error('API Error:', error);
    
    if (error.message.includes('401') || error.message.includes('403')) {
        // Unauthorized - redirect to login
        authAPI.logout();
        window.location.href = '/';
        return 'Sesi Anda telah berakhir. Silakan login kembali.';
    }
    
    return error.message || 'Terjadi kesalahan. Silakan coba lagi.';
};
