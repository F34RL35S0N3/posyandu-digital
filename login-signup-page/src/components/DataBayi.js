import React, { useState, useEffect } from 'react';
import { babiesAPI, handleAPIError, formatDate, calculateAge } from '../services/api';
import './DataBayi.css';

const DataBayi = ({ onNavigate, onBack }) => {
    const [babies, setBabies] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'detail'
    const [selectedBaby, setSelectedBaby] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('nama');

    // Sample data
    const sampleBabies = [
        {
            id: 'B001',
            nama: 'Andi Pratama',
            tanggalLahir: '2023-01-15',
            jenisKelamin: 'Laki-laki',
            alamat: 'Jl. Mawar No. 123, Jakarta',
            namaOrtu: 'Budi Pratama & Siti Pratama',
            noTelp: '081234567890',
            riwayat: [
                { tanggal: '2024-01-15', usia: '12 bulan', berat: 9.5, tinggi: 75, status: 'Normal' },
                { tanggal: '2023-12-15', usia: '11 bulan', berat: 9.0, tinggi: 73, status: 'Normal' },
                { tanggal: '2023-11-15', usia: '10 bulan', berat: 8.5, tinggi: 71, status: 'Normal' }
            ]
        },
        {
            id: 'B002',
            nama: 'Siti Nurhaliza',
            tanggalLahir: '2023-03-20',
            jenisKelamin: 'Perempuan',
            alamat: 'Jl. Melati No. 456, Bandung',
            namaOrtu: 'Ahmad Sari & Dewi Sari',
            noTelp: '081234567891',
            riwayat: [
                { tanggal: '2024-01-20', usia: '10 bulan', berat: 8.2, tinggi: 70, status: 'Normal' },
                { tanggal: '2023-12-20', usia: '9 bulan', berat: 7.8, tinggi: 68, status: 'Normal' }
            ]
        },
        {
            id: 'B003',
            nama: 'Muhammad Rizki',
            tanggalLahir: '2022-11-10',
            jenisKelamin: 'Laki-laki',
            alamat: 'Jl. Anggrek No. 789, Surabaya',
            namaOrtu: 'Rizki Senior & Indah Permata',
            noTelp: '081234567892',
            riwayat: [
                { tanggal: '2024-01-10', usia: '14 bulan', berat: 10.5, tinggi: 78, status: 'Normal' },
                { tanggal: '2023-12-10', usia: '13 bulan', berat: 10.0, tinggi: 76, status: 'Normal' }
            ]
        }
    ];

    useEffect(() => {
        setBabies(sampleBabies);
        setIsVisible(true);
    }, []);

    const [formData, setFormData] = useState({
        nama: '',
        tanggalLahir: '',
        jenisKelamin: 'Laki-laki',
        alamat: '',
        namaOrtu: '',
        noTelp: ''
    });

    const filteredBabies = babies.filter(baby =>
        baby.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        baby.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedBabies = [...filteredBabies].sort((a, b) => {
        if (sortBy === 'nama') return a.nama.localeCompare(b.nama);
        if (sortBy === 'id') return a.id.localeCompare(b.id);
        if (sortBy === 'tanggalLahir') return new Date(b.tanggalLahir) - new Date(a.tanggalLahir);
        return 0;
    });

    const handleAdd = () => {
        setModalType('add');
        setFormData({
            nama: '',
            tanggalLahir: '',
            jenisKelamin: 'Laki-laki',
            alamat: '',
            namaOrtu: '',
            noTelp: ''
        });
        setShowModal(true);
    };

    const handleEdit = (baby) => {
        setModalType('edit');
        setSelectedBaby(baby);
        setFormData(baby);
        setShowModal(true);
    };

    const handleDetail = (baby) => {
        setSelectedBaby(baby);
        setModalType('detail');
        setShowModal(true);
    };

    const handleDelete = (baby) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus data ${baby.nama}?`)) {
            setBabies(babies.filter(b => b.id !== baby.id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalType === 'add') {
            const newId = `B${String(babies.length + 1).padStart(3, '0')}`;
            const newBaby = {
                ...formData,
                id: newId,
                riwayat: []
            };
            setBabies([...babies, newBaby]);
        } else if (modalType === 'edit') {
            setBabies(babies.map(b => b.id === selectedBaby.id ? { ...formData, id: selectedBaby.id, riwayat: selectedBaby.riwayat } : b));
        }
        setShowModal(false);
    };

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        const diffTime = Math.abs(today - birth);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.floor(diffDays / 30);
        return `${months} bulan`;
    };

    const getLatestMeasurement = (riwayat) => {
        if (!riwayat || riwayat.length === 0) return null;
        return riwayat[0];
    };

    return (
        <div className="data-bayi-container">
            <div className="page-header">
                <button className="back-button" onClick={onBack}>
                    <span>←</span>
                    Kembali
                </button>
                <div className="header-content">
                    <h1>Data Bayi Posyandu</h1>
                    <p>Kelola data dan informasi bayi secara digital</p>
                </div>
            </div>

            <div className={`data-bayi-main ${isVisible ? 'visible' : ''}`}>
                {/* Controls */}
                <div className="controls-section">
                    <div className="search-section">
                        <div className="search-container">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama atau ID bayi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="nama">Urutkan: Nama</option>
                            <option value="id">Urutkan: ID</option>
                            <option value="tanggalLahir">Urutkan: Tanggal Lahir</option>
                        </select>
                    </div>
                    <button className="add-button" onClick={handleAdd}>
                        <span>+</span>
                        Tambah Data Bayi
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-icon">👶</div>
                        <div className="stat-info">
                            <h3>Total Bayi</h3>
                            <span>{babies.length}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">👦</div>
                        <div className="stat-info">
                            <h3>Laki-laki</h3>
                            <span>{babies.filter(b => b.jenisKelamin === 'Laki-laki').length}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">👧</div>
                        <div className="stat-info">
                            <h3>Perempuan</h3>
                            <span>{babies.filter(b => b.jenisKelamin === 'Perempuan').length}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📏</div>
                        <div className="stat-info">
                            <h3>Pengukuran Terbaru</h3>
                            <span>{babies.filter(b => b.riwayat && b.riwayat.length > 0).length}</span>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="table-container">
                    <div className="table-header">
                        <h2>Daftar Bayi Terdaftar ({sortedBabies.length} data)</h2>
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID Bayi</th>
                                    <th>Nama Lengkap</th>
                                    <th>Usia</th>
                                    <th>Jenis Kelamin</th>
                                    <th>Pengukuran Terakhir</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedBabies.map((baby, index) => {
                                    const latestMeasurement = getLatestMeasurement(baby.riwayat);
                                    return (
                                        <tr key={baby.id} style={{ animationDelay: `${index * 0.1}s` }}>
                                            <td>
                                                <span className="baby-id">{baby.id}</span>
                                            </td>
                                            <td>
                                                <div className="baby-info">
                                                    <span className="baby-name">{baby.nama}</span>
                                                    <span className="baby-parent">{baby.namaOrtu}</span>
                                                </div>
                                            </td>
                                            <td>{calculateAge(baby.tanggalLahir)}</td>
                                            <td>
                                                <span className={`gender-badge ${baby.jenisKelamin.toLowerCase()}`}>
                                                    {baby.jenisKelamin === 'Laki-laki' ? '👦' : '👧'} {baby.jenisKelamin}
                                                </span>
                                            </td>
                                            <td>
                                                {latestMeasurement ? (
                                                    <div className="measurement-info">
                                                        <span>Berat: {latestMeasurement.berat}kg</span>
                                                        <span>Tinggi: {latestMeasurement.tinggi}cm</span>
                                                    </div>
                                                ) : (
                                                    <span className="no-measurement">Belum ada pengukuran</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`status-badge ${latestMeasurement?.status.toLowerCase() || 'pending'}`}>
                                                    {latestMeasurement?.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="action-btn detail-btn" 
                                                        onClick={() => handleDetail(baby)}
                                                        title="Lihat Detail"
                                                    >
                                                        👁️
                                                    </button>
                                                    <button 
                                                        className="action-btn edit-btn" 
                                                        onClick={() => handleEdit(baby)}
                                                        title="Edit Data"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button 
                                                        className="action-btn delete-btn" 
                                                        onClick={() => handleDelete(baby)}
                                                        title="Hapus Data"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {modalType === 'add' && '➕ Tambah Data Bayi Baru'}
                                {modalType === 'edit' && '✏️ Edit Data Bayi'}
                                {modalType === 'detail' && '👁️ Detail & Riwayat Bayi'}
                            </h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {modalType === 'detail' ? (
                                <div className="detail-content">
                                    <div className="baby-profile">
                                        <div className="profile-header">
                                            <div className="profile-avatar">
                                                {selectedBaby?.jenisKelamin === 'Laki-laki' ? '👦' : '👧'}
                                            </div>
                                            <div className="profile-info">
                                                <h3>{selectedBaby?.nama}</h3>
                                                <p>ID: {selectedBaby?.id}</p>
                                                <p>Usia: {calculateAge(selectedBaby?.tanggalLahir)}</p>
                                            </div>
                                        </div>
                                        <div className="profile-details">
                                            <div className="detail-item">
                                                <strong>Tanggal Lahir:</strong> {new Date(selectedBaby?.tanggalLahir).toLocaleDateString('id-ID')}
                                            </div>
                                            <div className="detail-item">
                                                <strong>Jenis Kelamin:</strong> {selectedBaby?.jenisKelamin}
                                            </div>
                                            <div className="detail-item">
                                                <strong>Alamat:</strong> {selectedBaby?.alamat}
                                            </div>
                                            <div className="detail-item">
                                                <strong>Nama Orang Tua:</strong> {selectedBaby?.namaOrtu}
                                            </div>
                                            <div className="detail-item">
                                                <strong>No. Telepon:</strong> {selectedBaby?.noTelp}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="history-section">
                                        <h3>📊 Riwayat Pengukuran</h3>
                                        {selectedBaby?.riwayat && selectedBaby.riwayat.length > 0 ? (
                                            <div className="history-table">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Tanggal</th>
                                                            <th>Usia</th>
                                                            <th>Berat (kg)</th>
                                                            <th>Tinggi (cm)</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedBaby.riwayat.map((record, index) => (
                                                            <tr key={index}>
                                                                <td>{new Date(record.tanggal).toLocaleDateString('id-ID')}</td>
                                                                <td>{record.usia}</td>
                                                                <td>{record.berat}</td>
                                                                <td>{record.tinggi}</td>
                                                                <td>
                                                                    <span className={`status-badge ${record.status.toLowerCase()}`}>
                                                                        {record.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="no-history">
                                                <p>📝 Belum ada riwayat pengukuran</p>
                                                <button 
                                                    className="add-measurement-btn"
                                                    onClick={() => {
                                                        setShowModal(false);
                                                        onNavigate('pengukuran');
                                                    }}
                                                >
                                                    Lakukan Pengukuran Pertama
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="baby-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Nama Lengkap Bayi</label>
                                            <input
                                                type="text"
                                                value={formData.nama}
                                                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                                                required
                                                placeholder="Masukkan nama lengkap bayi"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Tanggal Lahir</label>
                                            <input
                                                type="date"
                                                value={formData.tanggalLahir}
                                                onChange={(e) => setFormData({...formData, tanggalLahir: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Jenis Kelamin</label>
                                            <select
                                                value={formData.jenisKelamin}
                                                onChange={(e) => setFormData({...formData, jenisKelamin: e.target.value})}
                                            >
                                                <option value="Laki-laki">Laki-laki</option>
                                                <option value="Perempuan">Perempuan</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>No. Telepon Orang Tua</label>
                                            <input
                                                type="tel"
                                                value={formData.noTelp}
                                                onChange={(e) => setFormData({...formData, noTelp: e.target.value})}
                                                required
                                                placeholder="081234567890"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Nama Lengkap Orang Tua</label>
                                        <input
                                            type="text"
                                            value={formData.namaOrtu}
                                            onChange={(e) => setFormData({...formData, namaOrtu: e.target.value})}
                                            required
                                            placeholder="Nama Ayah & Nama Ibu"
                                        />
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
                                            {modalType === 'add' ? 'Tambah Data' : 'Simpan Perubahan'}
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

export default DataBayi;
