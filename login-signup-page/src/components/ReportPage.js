import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './ReportPage.css';

const ReportPage = ({ onBack, currentUser }) => {
    const [babies, setBabies] = useState([]);
    const [selectedBaby, setSelectedBaby] = useState(null);
    const [measurements, setMeasurements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const componentRef = useRef();

    // Sample data untuk demo (nanti akan diambil dari API)
    const sampleBabies = [
        {
            id: 1,
            name: 'Ahmad Rizki',
            birthDate: '2024-01-15',
            age: '8 bulan',
            parentName: 'Siti Aminah',
            parentPhone: '081234567890',
            address: 'Jl. Melati No. 123, RT 02/RW 05, Kelurahan Sukamaju, Kecamatan Cikarang Utara, Bekasi'
        },
        {
            id: 2,
            name: 'Fatimah Zahra',
            birthDate: '2023-09-20',
            age: '11 bulan',
            parentName: 'Dewi Sartika',
            parentPhone: '081987654321',
            address: 'Jl. Mawar No. 45, RT 01/RW 03, Kelurahan Harapan Jaya, Kecamatan Cikarang Selatan, Bekasi'
        },
        {
            id: 3,
            name: 'Muhammad Alif',
            birthDate: '2024-03-10',
            age: '5 bulan',
            parentName: 'Rina Marlina',
            parentPhone: '082345678901',
            address: 'Jl. Anggrek No. 78, RT 03/RW 02, Kelurahan Mekarsari, Kecamatan Cikarang Barat, Bekasi'
        }
    ];

    const sampleMeasurements = {
        1: [
            { date: '2024-08-01', weight: 8.5, height: 68, notes: 'Pertumbuhan normal' },
            { date: '2024-07-01', weight: 8.2, height: 67, notes: 'Sehat' },
            { date: '2024-06-01', weight: 7.8, height: 66, notes: 'Baik' }
        ],
        2: [
            { date: '2024-08-01', weight: 9.2, height: 72, notes: 'Pertumbuhan baik' },
            { date: '2024-07-01', weight: 8.9, height: 71, notes: 'Sehat dan aktif' },
            { date: '2024-06-01', weight: 8.6, height: 70, notes: 'Normal' }
        ],
        3: [
            { date: '2024-08-01', weight: 7.1, height: 63, notes: 'Sesuai usia' },
            { date: '2024-07-01', weight: 6.8, height: 62, notes: 'Tumbuh sehat' },
            { date: '2024-06-01', weight: 6.5, height: 61, notes: 'Baik' }
        ]
    };

    useEffect(() => {
        // Load sample data
        setBabies(sampleBabies);
    }, []);

    const handleBabySelect = (baby) => {
        setSelectedBaby(baby);
        setMeasurements(sampleMeasurements[baby.id] || []);
    };

    const calculateAge = (birthDate) => {
        const birth = new Date(birthDate);
        const today = new Date();
        const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
        return `${months} bulan`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Laporan-${selectedBaby?.name}-${new Date().toISOString().split('T')[0]}`
    });

    const handleDownloadPDF = async () => {
        if (!componentRef.current) return;

        setLoading(true);
        try {
            const canvas = await html2canvas(componentRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: true
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Laporan-${selectedBaby?.name}-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            setError('Gagal membuat PDF. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendWhatsApp = () => {
        if (!selectedBaby) return;

        const message = encodeURIComponent(
            `*LAPORAN POSYANDU DIGITAL*\n\n` +
            `Nama Bayi: ${selectedBaby.name}\n` +
            `Umur: ${calculateAge(selectedBaby.birthDate)}\n` +
            `Tanggal Lahir: ${formatDate(selectedBaby.birthDate)}\n\n` +
            `*HASIL PENGUKURAN TERAKHIR:*\n` +
            `Berat Badan: ${measurements[0]?.weight || '-'} kg\n` +
            `Tinggi Badan: ${measurements[0]?.height || '-'} cm\n` +
            `Tanggal Pemeriksaan: ${measurements[0] ? formatDate(measurements[0].date) : '-'}\n\n` +
            `Alamat: ${selectedBaby.address}\n\n` +
            `Terima kasih telah menggunakan layanan Posyandu Digital.\n` +
            `Untuk informasi lebih lanjut, hubungi petugas posyandu.`
        );

        const whatsappUrl = `https://wa.me/${selectedBaby.parentPhone}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    const getGrowthStatus = (weight, height, age) => {
        // Simple growth status calculation (simplified for demo)
        const ageInMonths = parseInt(age);
        if (ageInMonths <= 6) {
            if (weight >= 6 && weight <= 8 && height >= 60 && height <= 70) {
                return { status: 'Normal', color: 'green' };
            }
        } else if (ageInMonths <= 12) {
            if (weight >= 7 && weight <= 10 && height >= 65 && height <= 75) {
                return { status: 'Normal', color: 'green' };
            }
        }
        return { status: 'Perlu Perhatian', color: 'orange' };
    };

    return (
        <div className="report-page">
            <div className="report-header">
                <div className="header-navigation">
                    <button 
                        onClick={onBack}
                        className="back-btn"
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            marginBottom: '20px',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.2)';
                        }}
                    >
                        ← Kembali ke Dashboard
                    </button>
                </div>
                <h1>📊 Laporan Posyandu Digital</h1>
                <p>Laporan Hasil Pengukuran Bayi dan Balita</p>
            </div>

            <div className="report-content">
                {/* Baby Selection */}
                <div className="baby-selection">
                    <h3>Pilih Bayi untuk Laporan:</h3>
                    <div className="baby-grid">
                        {babies.map(baby => (
                            <div 
                                key={baby.id}
                                className={`baby-card ${selectedBaby?.id === baby.id ? 'selected' : ''}`}
                                onClick={() => handleBabySelect(baby)}
                            >
                                <div className="baby-avatar">👶</div>
                                <h4>{baby.name}</h4>
                                <p>{calculateAge(baby.birthDate)}</p>
                                <small>{baby.parentName}</small>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Report Display */}
                {selectedBaby && (
                    <div className="report-display">
                        <div className="report-actions">
                            <button 
                                onClick={handlePrint}
                                className="action-btn print-btn"
                                disabled={loading}
                            >
                                🖨️ Print Laporan
                            </button>
                            <button 
                                onClick={handleDownloadPDF}
                                className="action-btn pdf-btn"
                                disabled={loading}
                            >
                                📄 Download PDF
                            </button>
                            <button 
                                onClick={handleSendWhatsApp}
                                className="action-btn whatsapp-btn"
                                disabled={loading}
                            >
                                📱 Kirim WhatsApp
                            </button>
                        </div>

                        {error && (
                            <div className="error-message">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Printable Report */}
                        <div ref={componentRef} className="printable-report">
                            <div className="report-letterhead">
                                <div className="logo-section">
                                    <div className="logo">⚕️</div>
                                    <div className="header-text">
                                        <h1>POSYANDU DIGITAL</h1>
                                        <p>Sistem Informasi Kesehatan Bayi dan Balita</p>
                                        <p>Jl. Kesehatan No. 123, Bekasi - Telp: (021) 123-4567</p>
                                    </div>
                                </div>
                                <hr className="divider" />
                            </div>

                            <div className="report-title">
                                <h2>LAPORAN HASIL PENGUKURAN</h2>
                                <p>Tanggal Laporan: {formatDate(new Date().toISOString())}</p>
                            </div>

                            <div className="report-body">
                                <div className="baby-info-section">
                                    <h3>INFORMASI BAYI</h3>
                                    <table className="info-table">
                                        <tbody>
                                            <tr>
                                                <td><strong>Nama Bayi</strong></td>
                                                <td>: {selectedBaby.name}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Umur Bayi</strong></td>
                                                <td>: {calculateAge(selectedBaby.birthDate)}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Tanggal Lahir</strong></td>
                                                <td>: {formatDate(selectedBaby.birthDate)}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Nama Orang Tua</strong></td>
                                                <td>: {selectedBaby.parentName}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Alamat Domisili</strong></td>
                                                <td>: {selectedBaby.address}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="measurements-section">
                                    <h3>HASIL PENGUKURAN</h3>
                                    <table className="measurements-table">
                                        <thead>
                                            <tr>
                                                <th>Tanggal</th>
                                                <th>Berat Badan (kg)</th>
                                                <th>Tinggi Badan (cm)</th>
                                                <th>Status</th>
                                                <th>Keterangan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {measurements.map((measurement, index) => {
                                                const growth = getGrowthStatus(
                                                    measurement.weight,
                                                    measurement.height,
                                                    calculateAge(selectedBaby.birthDate)
                                                );
                                                return (
                                                    <tr key={index}>
                                                        <td>{formatDate(measurement.date)}</td>
                                                        <td>{measurement.weight}</td>
                                                        <td>{measurement.height}</td>
                                                        <td style={{ color: growth.color }}>
                                                            <strong>{growth.status}</strong>
                                                        </td>
                                                        <td>{measurement.notes}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="growth-chart-section">
                                    <h3>GRAFIK PERTUMBUHAN</h3>
                                    <div className="chart-placeholder">
                                        <div className="chart-info">
                                            <h4>Perkembangan Berat Badan</h4>
                                            {measurements.length > 0 && (
                                                <div className="chart-data">
                                                    <p>Berat Tertinggi: {Math.max(...measurements.map(m => m.weight))} kg</p>
                                                    <p>Berat Terendah: {Math.min(...measurements.map(m => m.weight))} kg</p>
                                                    <p>Rata-rata: {(measurements.reduce((acc, m) => acc + m.weight, 0) / measurements.length).toFixed(1)} kg</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="chart-info">
                                            <h4>Perkembangan Tinggi Badan</h4>
                                            {measurements.length > 0 && (
                                                <div className="chart-data">
                                                    <p>Tinggi Tertinggi: {Math.max(...measurements.map(m => m.height))} cm</p>
                                                    <p>Tinggi Terendah: {Math.min(...measurements.map(m => m.height))} cm</p>
                                                    <p>Rata-rata: {(measurements.reduce((acc, m) => acc + m.height, 0) / measurements.length).toFixed(1)} cm</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="recommendations">
                                    <h3>REKOMENDASI</h3>
                                    <div className="recommendation-box">
                                        {measurements.length > 0 && (() => {
                                            const latestMeasurement = measurements[0];
                                            const growth = getGrowthStatus(
                                                latestMeasurement.weight,
                                                latestMeasurement.height,
                                                calculateAge(selectedBaby.birthDate)
                                            );
                                            
                                            if (growth.status === 'Normal') {
                                                return (
                                                    <div>
                                                        <p>✅ <strong>Pertumbuhan Normal</strong></p>
                                                        <ul>
                                                            <li>Lanjutkan pemberian ASI eksklusif atau makanan bergizi</li>
                                                            <li>Rutin kontrol setiap bulan ke posyandu</li>
                                                            <li>Berikan imunisasi sesuai jadwal</li>
                                                            <li>Jaga kebersihan dan kesehatan bayi</li>
                                                        </ul>
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <div>
                                                        <p>⚠️ <strong>Perlu Perhatian Khusus</strong></p>
                                                        <ul>
                                                            <li>Konsultasi dengan petugas kesehatan</li>
                                                            <li>Evaluasi pola makan dan nutrisi</li>
                                                            <li>Kontrol lebih intensif</li>
                                                            <li>Pantau perkembangan secara berkala</li>
                                                        </ul>
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>

                            <div className="report-footer">
                                <div className="signature-section">
                                    <div className="signature-box">
                                        <p>Bekasi, {formatDate(new Date().toISOString())}</p>
                                        <p><strong>Petugas Posyandu</strong></p>
                                        <div className="signature-space"></div>
                                        <p>(_________________)</p>
                                        <p>NIP: 123456789</p>
                                    </div>
                                </div>
                                <div className="contact-info">
                                    <p><strong>Catatan:</strong> Laporan ini dibuat secara digital oleh Sistem Posyandu Digital</p>
                                    <p>Untuk informasi lebih lanjut hubungi: (021) 123-4567 atau email: posyandu@digital.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportPage;
