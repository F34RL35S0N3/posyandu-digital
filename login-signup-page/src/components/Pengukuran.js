import React, { useState, useEffect } from 'react';
import './Pengukuran.css';

const Pengukuran = ({ onBack }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedBabyId, setSelectedBabyId] = useState('');
    const [selectedBaby, setSelectedBaby] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [currentWeight, setCurrentWeight] = useState(0);
    const [currentHeight, setCurrentHeight] = useState(0);
    const [isStable, setIsStable] = useState(false);
    const [measurement, setMeasurement] = useState({ weight: 0, height: 0 });
    const [showSaveModal, setShowSaveModal] = useState(false);

    // Sample baby data
    const babies = [
        { id: 'B001', nama: 'Andi Pratama', usia: '12 bulan' },
        { id: 'B002', nama: 'Siti Nurhaliza', usia: '10 bulan' },
        { id: 'B003', nama: 'Muhammad Rizki', usia: '14 bulan' },
        { id: 'B004', nama: 'Fatimah Zahra', usia: '8 bulan' },
        { id: 'B005', nama: 'Ahmad Faiz', usia: '15 bulan' }
    ];

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Simulate sensor connection
    useEffect(() => {
        if (isScanning) {
            const interval = setInterval(() => {
                // Simulate realistic weight fluctuation (6-12 kg for babies)
                const baseWeight = 7 + Math.random() * 4;
                const weightFluctuation = (Math.random() - 0.5) * 0.3;
                const newWeight = Math.max(0, baseWeight + weightFluctuation);

                // Simulate realistic height (60-85 cm for babies)
                const baseHeight = 65 + Math.random() * 15;
                const heightFluctuation = (Math.random() - 0.5) * 2;
                const newHeight = Math.max(0, baseHeight + heightFluctuation);

                setCurrentWeight(parseFloat(newWeight.toFixed(2)));
                setCurrentHeight(parseFloat(newHeight.toFixed(1)));

                // Determine if readings are stable (less fluctuation)
                setIsStable(Math.abs(weightFluctuation) < 0.1 && Math.abs(heightFluctuation) < 0.5);
            }, 500);

            return () => clearInterval(interval);
        }
    }, [isScanning]);

    const handleBabySelect = (babyId) => {
        const baby = babies.find(b => b.id === babyId);
        setSelectedBabyId(babyId);
        setSelectedBaby(baby);
    };

    const handleConnect = () => {
        setIsConnected(true);
        // Simulate connection process
        setTimeout(() => {
            setIsScanning(true);
        }, 1000);
    };

    const handleDisconnect = () => {
        setIsConnected(false);
        setIsScanning(false);
        setCurrentWeight(0);
        setCurrentHeight(0);
        setIsStable(false);
    };

    const handleCapture = () => {
        if (isStable) {
            setMeasurement({
                weight: currentWeight,
                height: currentHeight
            });
            setShowSaveModal(true);
        }
    };

    const handleSave = () => {
        // Here you would save to database
        console.log('Saving measurement:', {
            babyId: selectedBabyId,
            baby: selectedBaby,
            weight: measurement.weight,
            height: measurement.height,
            timestamp: new Date().toISOString()
        });
        
        setShowSaveModal(false);
        setMeasurement({ weight: 0, height: 0 });
        
        // Show success message
        alert(`Pengukuran berhasil disimpan!\nBerat: ${measurement.weight}kg\nTinggi: ${measurement.height}cm`);
    };

    const getStatusColor = () => {
        if (!isConnected) return '#94a3b8';
        if (!isScanning) return '#fbbf24';
        if (isStable) return '#22c55e';
        return '#f59e0b';
    };

    const getStatusText = () => {
        if (!isConnected) return 'Tidak Terhubung';
        if (!isScanning) return 'Menghubungkan...';
        if (isStable) return 'Stabil - Siap Diambil';
        return 'Sedang Membaca...';
    };

    return (
        <div className="pengukuran-container">
            <div className="page-header">
                <button className="back-button" onClick={onBack}>
                    <span>←</span>
                    Kembali
                </button>
                <div className="header-content">
                    <h1>🏥 Pengukuran Real-time</h1>
                    <p>Ambil data berat dan tinggi badan secara otomatis dari sensor</p>
                </div>
            </div>

            <div className={`pengukuran-main ${isVisible ? 'visible' : ''}`}>
                {/* Status Dashboard */}
                <div className="status-dashboard">
                    <div className="status-card">
                        <div className="status-indicator">
                            <div 
                                className={`status-light ${isConnected ? 'connected' : 'disconnected'}`}
                                style={{ backgroundColor: getStatusColor() }}
                            ></div>
                            <span className="status-text">{getStatusText()}</span>
                        </div>
                        <div className="connection-controls">
                            {!isConnected ? (
                                <button className="connect-btn" onClick={handleConnect}>
                                    🔗 Hubungkan Sensor
                                </button>
                            ) : (
                                <button className="disconnect-btn" onClick={handleDisconnect}>
                                    ❌ Putuskan Koneksi
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Baby Selection */}
                <div className="baby-selection">
                    <h2>👶 Pilih Bayi</h2>
                    <div className="baby-grid">
                        {babies.map((baby) => (
                            <div
                                key={baby.id}
                                className={`baby-card ${selectedBabyId === baby.id ? 'selected' : ''}`}
                                onClick={() => handleBabySelect(baby.id)}
                            >
                                <div className="baby-avatar">👶</div>
                                <div className="baby-info">
                                    <h3>{baby.nama}</h3>
                                    <p>ID: {baby.id}</p>
                                    <p>Usia: {baby.usia}</p>
                                </div>
                                {selectedBabyId === baby.id && (
                                    <div className="selected-indicator">✅</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Measurement Display */}
                <div className="measurement-display">
                    <h2>📊 Data Pengukuran Real-time</h2>
                    <div className="sensors-grid">
                        {/* Weight Sensor */}
                        <div className="sensor-card weight-sensor">
                            <div className="sensor-header">
                                <div className="sensor-icon">⚖️</div>
                                <div className="sensor-info">
                                    <h3>Load Cell</h3>
                                    <p>Sensor Berat Badan</p>
                                </div>
                            </div>
                            <div className="sensor-display">
                                <div className="measurement-value">
                                    {currentWeight.toFixed(2)}
                                    <span className="unit">kg</span>
                                </div>
                                <div className="measurement-chart">
                                    <div 
                                        className="chart-bar"
                                        style={{ 
                                            height: `${Math.min((currentWeight / 15) * 100, 100)}%`,
                                            backgroundColor: isStable ? '#22c55e' : '#f59e0b'
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="sensor-status">
                                <div className={`status-dot ${isStable ? 'stable' : 'reading'}`}></div>
                                <span>{isStable ? 'Stabil' : 'Membaca...'}</span>
                            </div>
                        </div>

                        {/* Height Sensor */}
                        <div className="sensor-card height-sensor">
                            <div className="sensor-header">
                                <div className="sensor-icon">📏</div>
                                <div className="sensor-info">
                                    <h3>Ultrasonik</h3>
                                    <p>Sensor Tinggi Badan</p>
                                </div>
                            </div>
                            <div className="sensor-display">
                                <div className="measurement-value">
                                    {currentHeight.toFixed(1)}
                                    <span className="unit">cm</span>
                                </div>
                                <div className="measurement-chart">
                                    <div 
                                        className="chart-bar"
                                        style={{ 
                                            height: `${Math.min((currentHeight / 100) * 100, 100)}%`,
                                            backgroundColor: isStable ? '#22c55e' : '#f59e0b'
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="sensor-status">
                                <div className={`status-dot ${isStable ? 'stable' : 'reading'}`}></div>
                                <span>{isStable ? 'Stabil' : 'Membaca...'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Capture Controls */}
                    <div className="capture-controls">
                        <div className="capture-info">
                            <h3>📸 Ambil Pengukuran</h3>
                            <p>
                                {!selectedBaby 
                                    ? 'Pilih bayi terlebih dahulu' 
                                    : !isConnected 
                                    ? 'Hubungkan sensor terlebih dahulu'
                                    : !isStable 
                                    ? 'Tunggu pembacaan stabil...'
                                    : `Siap mengambil data untuk ${selectedBaby.nama}`
                                }
                            </p>
                        </div>
                        <button 
                            className="capture-btn"
                            onClick={handleCapture}
                            disabled={!selectedBaby || !isConnected || !isStable}
                        >
                            {isStable ? '📸 Ambil Data' : '⏳ Tunggu Stabil'}
                        </button>
                    </div>
                </div>

                {/* Instructions */}
                <div className="instructions">
                    <h2>📋 Petunjuk Penggunaan</h2>
                    <div className="instruction-steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h4>Pilih Bayi</h4>
                                <p>Klik pada kartu bayi yang akan diukur</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h4>Hubungkan Sensor</h4>
                                <p>Klik tombol "Hubungkan Sensor" untuk memulai</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h4>Posisikan Bayi</h4>
                                <p>Letakkan bayi pada timbangan dengan posisi yang tepat</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h4>Tunggu Stabil</h4>
                                <p>Tunggu hingga indicator menunjukkan "Stabil"</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">5</div>
                            <div className="step-content">
                                <h4>Ambil Data</h4>
                                <p>Klik "Ambil Data" untuk menyimpan pengukuran</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Modal */}
            {showSaveModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>💾 Konfirmasi Penyimpanan</h2>
                            <button className="close-btn" onClick={() => setShowSaveModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="save-summary">
                                <div className="summary-header">
                                    <div className="baby-avatar">👶</div>
                                    <div className="baby-details">
                                        <h3>{selectedBaby?.nama}</h3>
                                        <p>ID: {selectedBaby?.id}</p>
                                        <p>Usia: {selectedBaby?.usia}</p>
                                    </div>
                                </div>
                                <div className="measurement-summary">
                                    <div className="measurement-item">
                                        <div className="measurement-icon">⚖️</div>
                                        <div className="measurement-data">
                                            <span className="label">Berat Badan</span>
                                            <span className="value">{measurement.weight} kg</span>
                                        </div>
                                    </div>
                                    <div className="measurement-item">
                                        <div className="measurement-icon">📏</div>
                                        <div className="measurement-data">
                                            <span className="label">Tinggi Badan</span>
                                            <span className="value">{measurement.height} cm</span>
                                        </div>
                                    </div>
                                    <div className="measurement-item">
                                        <div className="measurement-icon">📅</div>
                                        <div className="measurement-data">
                                            <span className="label">Tanggal</span>
                                            <span className="value">{new Date().toLocaleDateString('id-ID')}</span>
                                        </div>
                                    </div>
                                    <div className="measurement-item">
                                        <div className="measurement-icon">⏰</div>
                                        <div className="measurement-data">
                                            <span className="label">Waktu</span>
                                            <span className="value">{new Date().toLocaleTimeString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button className="cancel-btn" onClick={() => setShowSaveModal(false)}>
                                    Batal
                                </button>
                                <button className="save-btn" onClick={handleSave}>
                                    💾 Simpan Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pengukuran;
