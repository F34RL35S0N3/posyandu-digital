import React, { useState, useEffect } from 'react';
import './DataPetugas.css';

const DataPetugas = ({ onBack, currentUser }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [petugas, setPetugas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [selectedPetugas, setSelectedPetugas] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Sample data petugas
    const samplePetugas = [
        {
            id: 'P001',
            username: 'posyandu22',
            nama: 'Dr. Siti Nurhaliza',
            email: 'siti.nurhaliza@posyandu.id',
            noTelp: '081234567890',
            jabatan: 'Kepala Posyandu',
            alamat: 'Jl. Kesehatan No. 123, Jakarta',
            tanggalBergabung: '2023-01-15',
            status: 'Aktif',
            lastLogin: '2024-01-30 09:30:00'
        },
        {
            id: 'P002',
            username: 'bidan_maya',
            nama: 'Maya Sari, Am.Keb',
            email: 'maya.sari@posyandu.id',
            noTelp: '081234567891',
            jabatan: 'Bidan',
            alamat: 'Jl. Melati No. 456, Jakarta',
            tanggalBergabung: '2023-02-20',
            status: 'Aktif',
            lastLogin: '2024-01-29 14:20:00'
        },
        {
            id: 'P003',
            username: 'admin_andi',
            nama: 'Andi Pratama',
            email: 'andi.pratama@posyandu.id',
            noTelp: '081234567892',
            jabatan: 'Admin',
            alamat: 'Jl. Anggrek No. 789, Jakarta',
            tanggalBergabung: '2023-03-10',
            status: 'Aktif',
            lastLogin: '2024-01-28 16:45:00'
        }
    ];

    const [formData, setFormData] = useState({
        username: '',
        nama: '',
        email: '',
        password: '',
        noTelp: '',
        jabatan: 'Petugas',
        alamat: '',
        status: 'Aktif'
    });

    useEffect(() => {
        setPetugas(samplePetugas);
        setIsVisible(true);
    }, []);

    const filteredPetugas = petugas.filter(p =>
        p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.jabatan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        setModalType('add');
        setFormData({
            username: '',
            nama: '',
            email: '',
            password: '',
            noTelp: '',
            jabatan: 'Petugas',
            alamat: '',
            status: 'Aktif'
        });
        setShowModal(true);
    };

    const handleEdit = (petugas) => {
        setModalType('edit');
        setSelectedPetugas(petugas);
        setFormData({
            ...petugas,
            password: '' // Don't show password
        });
        setShowModal(true);
    };

    const handleDetail = (petugas) => {
        setSelectedPetugas(petugas);
        setModalType('detail');
        setShowModal(true);
    };

    const handleDelete = (petugas) => {
        if (petugas.id === currentUser?.id) {
            alert('Anda tidak dapat menghapus akun sendiri!');
            return;
        }
        
        if (window.confirm(`Apakah Anda yakin ingin menghapus akun ${petugas.nama}?`)) {
            setPetugas(petugas.filter(p => p.id !== petugas.id));
        }
    };

    const handleToggleStatus = (petugas) => {
        if (petugas.id === currentUser?.id) {
            alert('Anda tidak dapat menonaktifkan akun sendiri!');
            return;
        }
        
        const newStatus = petugas.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
        setPetugas(petugas.map(p => 
            p.id === petugas.id ? { ...p, status: newStatus } : p
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (modalType === 'add') {
            const newId = `P${String(petugas.length + 1).padStart(3, '0')}`;
            const newPetugas = {
                ...formData,
                id: newId,
                tanggalBergabung: new Date().toISOString().split('T')[0],
                lastLogin: '-'
            };
            setPetugas([...petugas, newPetugas]);
        } else if (modalType === 'edit') {
            setPetugas(petugas.map(p => 
                p.id === selectedPetugas.id 
                    ? { ...p, ...formData, password: formData.password || p.password }
                    : p
            ));
        }
        
        setShowModal(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID');
    };

    const formatLastLogin = (dateString) => {
        if (!dateString || dateString === '-') return 'Belum pernah login';
        return new Date(dateString).toLocaleDateString('id-ID') + ' ' + 
               new Date(dateString).toLocaleTimeString('id-ID');
    };

    const getStatusBadgeClass = (status) => {
        return status === 'Aktif' ? 'status-active' : 'status-inactive';
    };

    const getJabatanIcon = (jabatan) => {
        switch (jabatan) {
            case 'Kepala Posyandu': return '👑';
            case 'Bidan': return '👩‍⚕️';
            case 'Admin': return '👨‍💼';
            case 'Petugas': return '👤';
            default: return '👤';
        }
    };

    return (
        <div className="data-petugas-container">
            <div className="page-header">
                <button className="back-button" onClick={onBack}>
                    <span>←</span>
                    Kembali
                </button>
                <div className="header-content">
                    <h1>👥 Data Petugas Posyandu</h1>
                    <p>Kelola akses dan informasi petugas yang terdaftar</p>
                </div>
            </div>

            <div className={`data-petugas-main ${isVisible ? 'visible' : ''}`}>
                {/* Controls */}
                <div className="controls-section">
                    <div className="search-section">
                        <div className="search-container">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama, username, atau jabatan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>
                    <button className="add-button" onClick={handleAdd}>
                        <span>+</span>
                        Tambah Petugas
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                            <h3>Total Petugas</h3>
                            <span>{petugas.length}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <h3>Petugas Aktif</h3>
                            <span>{petugas.filter(p => p.status === 'Aktif').length}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🌐</div>
                        <div className="stat-info">
                            <h3>Online Hari Ini</h3>
                            <span>{petugas.filter(p => p.lastLogin !== '-').length}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">👑</div>
                        <div className="stat-info">
                            <h3>Admin & Kepala</h3>
                            <span>{petugas.filter(p => p.jabatan === 'Admin' || p.jabatan === 'Kepala Posyandu').length}</span>
                        </div>
                    </div>
                </div>

                {/* Petugas Grid */}
                <div className="petugas-grid">
                    {filteredPetugas.map((petugasItem, index) => (
                        <div 
                            key={petugasItem.id} 
                            className="petugas-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="petugas-header">
                                <div className="petugas-avatar">
                                    {getJabatanIcon(petugasItem.jabatan)}
                                </div>
                                <div className="petugas-basic-info">
                                    <h3>{petugasItem.nama}</h3>
                                    <p className="username">@{petugasItem.username}</p>
                                    <span className="jabatan-badge">{petugasItem.jabatan}</span>
                                </div>
                                <div className="petugas-status">
                                    <span className={`status-badge ${getStatusBadgeClass(petugasItem.status)}`}>
                                        {petugasItem.status}
                                    </span>
                                </div>
                            </div>

                            <div className="petugas-details">
                                <div className="detail-item">
                                    <span className="detail-icon">📧</span>
                                    <span className="detail-text">{petugasItem.email}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-icon">📱</span>
                                    <span className="detail-text">{petugasItem.noTelp}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-icon">📅</span>
                                    <span className="detail-text">Bergabung: {formatDate(petugasItem.tanggalBergabung)}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-icon">⏰</span>
                                    <span className="detail-text">Login: {formatLastLogin(petugasItem.lastLogin)}</span>
                                </div>
                            </div>

                            <div className="petugas-actions">
                                <button 
                                    className="action-btn detail-btn" 
                                    onClick={() => handleDetail(petugasItem)}
                                    title="Lihat Detail"
                                >
                                    👁️ Detail
                                </button>
                                <button 
                                    className="action-btn edit-btn" 
                                    onClick={() => handleEdit(petugasItem)}
                                    title="Edit Data"
                                >
                                    ✏️ Edit
                                </button>
                                <button 
                                    className={`action-btn ${petugasItem.status === 'Aktif' ? 'deactivate-btn' : 'activate-btn'}`}
                                    onClick={() => handleToggleStatus(petugasItem)}
                                    title={petugasItem.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                                    disabled={petugasItem.id === currentUser?.id}
                                >
                                    {petugasItem.status === 'Aktif' ? '🔒 Nonaktifkan' : '🔓 Aktifkan'}
                                </button>
                                <button 
                                    className="action-btn delete-btn" 
                                    onClick={() => handleDelete(petugasItem)}
                                    title="Hapus Akun"
                                    disabled={petugasItem.id === currentUser?.id}
                                >
                                    🗑️ Hapus
                                </button>
                            </div>

                            {petugasItem.id === currentUser?.id && (
                                <div className="current-user-badge">
                                    <span>👤 Akun Anda</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {filteredPetugas.length === 0 && (
                    <div className="no-data">
                        <div className="no-data-icon">👥</div>
                        <h3>Tidak ada petugas ditemukan</h3>
                        <p>Coba ubah kata kunci pencarian atau tambah petugas baru</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {modalType === 'add' && '➕ Tambah Petugas Baru'}
                                {modalType === 'edit' && '✏️ Edit Data Petugas'}
                                {modalType === 'detail' && '👁️ Detail Petugas'}
                            </h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {modalType === 'detail' ? (
                                <div className="detail-content">
                                    <div className="petugas-profile">
                                        <div className="profile-header">
                                            <div className="profile-avatar">
                                                {getJabatanIcon(selectedPetugas?.jabatan)}
                                            </div>
                                            <div className="profile-info">
                                                <h3>{selectedPetugas?.nama}</h3>
                                                <p>@{selectedPetugas?.username}</p>
                                                <span className={`status-badge ${getStatusBadgeClass(selectedPetugas?.status)}`}>
                                                    {selectedPetugas?.status}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="profile-details-grid">
                                            <div className="detail-card">
                                                <h4>📧 Informasi Kontak</h4>
                                                <div className="detail-item">
                                                    <strong>Email:</strong> {selectedPetugas?.email}
                                                </div>
                                                <div className="detail-item">
                                                    <strong>No. Telepon:</strong> {selectedPetugas?.noTelp}
                                                </div>
                                                <div className="detail-item">
                                                    <strong>Alamat:</strong> {selectedPetugas?.alamat}
                                                </div>
                                            </div>
                                            
                                            <div className="detail-card">
                                                <h4>💼 Informasi Jabatan</h4>
                                                <div className="detail-item">
                                                    <strong>Jabatan:</strong> {selectedPetugas?.jabatan}
                                                </div>
                                                <div className="detail-item">
                                                    <strong>Status:</strong> {selectedPetugas?.status}
                                                </div>
                                                <div className="detail-item">
                                                    <strong>ID Petugas:</strong> {selectedPetugas?.id}
                                                </div>
                                            </div>
                                            
                                            <div className="detail-card">
                                                <h4>📅 Informasi Akun</h4>
                                                <div className="detail-item">
                                                    <strong>Tanggal Bergabung:</strong> {formatDate(selectedPetugas?.tanggalBergabung)}
                                                </div>
                                                <div className="detail-item">
                                                    <strong>Login Terakhir:</strong> {formatLastLogin(selectedPetugas?.lastLogin)}
                                                </div>
                                                <div className="detail-item">
                                                    <strong>Username:</strong> {selectedPetugas?.username}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="petugas-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Nama Lengkap</label>
                                            <input
                                                type="text"
                                                value={formData.nama}
                                                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                                                required
                                                placeholder="Masukkan nama lengkap"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Username</label>
                                            <input
                                                type="text"
                                                value={formData.username}
                                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                                required
                                                placeholder="Username untuk login"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                required
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>No. Telepon</label>
                                            <input
                                                type="tel"
                                                value={formData.noTelp}
                                                onChange={(e) => setFormData({...formData, noTelp: e.target.value})}
                                                required
                                                placeholder="081234567890"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Password {modalType === 'edit' && '(kosongkan jika tidak ingin mengubah)'}</label>
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                                required={modalType === 'add'}
                                                placeholder="Masukkan password"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Jabatan</label>
                                            <select
                                                value={formData.jabatan}
                                                onChange={(e) => setFormData({...formData, jabatan: e.target.value})}
                                            >
                                                <option value="Petugas">Petugas</option>
                                                <option value="Bidan">Bidan</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Kepala Posyandu">Kepala Posyandu</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                            >
                                                <option value="Aktif">Aktif</option>
                                                <option value="Nonaktif">Nonaktif</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Alamat Lengkap</label>
                                        <textarea
                                            value={formData.alamat}
                                            onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                                            required
                                            placeholder="Masukkan alamat lengkap"
                                            rows="3"
                                        />
                                    </div>
                                    <div className="form-actions">
                                        <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                                            Batal
                                        </button>
                                        <button type="submit" className="submit-btn">
                                            {modalType === 'add' ? 'Tambah Petugas' : 'Simpan Perubahan'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataPetugas;
