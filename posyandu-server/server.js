const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'posyandu_secret_key_2024';

// Database connection
const db = new sqlite3.Database('./database/posyandu.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeTables();
    }
});

// Middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Initialize database tables
function initializeTables() {
    // Users/Petugas table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            nama TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            noTelp TEXT,
            jabatan TEXT DEFAULT 'Petugas',
            alamat TEXT,
            status TEXT DEFAULT 'Aktif',
            tanggalBergabung DATETIME DEFAULT CURRENT_TIMESTAMP,
            lastLogin DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Babies table
    db.run(`
        CREATE TABLE IF NOT EXISTS babies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama TEXT NOT NULL,
            tanggalLahir DATE NOT NULL,
            jenisKelamin TEXT NOT NULL,
            alamat TEXT NOT NULL,
            namaOrtu TEXT NOT NULL,
            noTelp TEXT NOT NULL,
            status TEXT DEFAULT 'Aktif',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Measurements table
    db.run(`
        CREATE TABLE IF NOT EXISTS measurements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            babyId INTEGER NOT NULL,
            userId INTEGER NOT NULL,
            berat REAL NOT NULL,
            tinggi REAL NOT NULL,
            tanggalUkur DATETIME DEFAULT CURRENT_TIMESTAMP,
            catatan TEXT,
            status TEXT DEFAULT 'Normal',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (babyId) REFERENCES babies (id),
            FOREIGN KEY (userId) REFERENCES users (id)
        )
    `);

    // Insert default admin user
    const defaultPassword = bcrypt.hashSync('poltek23', 10);
    db.run(`
        INSERT OR IGNORE INTO users (username, password, nama, email, jabatan, alamat)
        VALUES ('posyandu22', ?, 'Admin Posyandu', 'admin@posyandu.id', 'Kepala Posyandu', 'Jl. Kesehatan No. 123, Jakarta')
    `, [defaultPassword]);

    console.log('Database tables initialized');
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Posyandu API Server is running',
        timestamp: new Date().toISOString() 
    });
});

// Authentication - Login
app.post('/api/auth/login', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ? AND status = "Aktif"', [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        db.run('UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

        const token = jwt.sign(
            { id: user.id, username: user.username, jabatan: user.jabatan },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                nama: user.nama,
                email: user.email,
                jabatan: user.jabatan
            }
        });
    });
});

// Users/Petugas routes
app.get('/api/users', authenticateToken, (req, res) => {
    db.all(`
        SELECT id, username, nama, email, noTelp, jabatan, alamat, status, 
               tanggalBergabung, lastLogin, createdAt 
        FROM users 
        ORDER BY createdAt DESC
    `, (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, data: users });
    });
});

app.post('/api/users', authenticateToken, [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('nama').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, nama, email, noTelp, jabatan, alamat } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(`
        INSERT INTO users (username, password, nama, email, noTelp, jabatan, alamat)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [username, hashedPassword, nama, email, noTelp, jabatan || 'Petugas', alamat], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Username or email already exists' });
            }
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.status(201).json({ 
            success: true, 
            message: 'User created successfully',
            data: { id: this.lastID }
        });
    });
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { nama, email, noTelp, jabatan, alamat, status } = req.body;

    db.run(`
        UPDATE users 
        SET nama = ?, email = ?, noTelp = ?, jabatan = ?, alamat = ?, status = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
    `, [nama, email, noTelp, jabatan, alamat, status, id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ success: true, message: 'User updated successfully' });
    });
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    // Prevent deleting own account
    if (req.user.id == id) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ success: true, message: 'User deleted successfully' });
    });
});

// Babies routes
app.get('/api/babies', authenticateToken, (req, res) => {
    db.all(`
        SELECT b.*, 
               COUNT(m.id) as totalMeasurements,
               MAX(m.tanggalUkur) as lastMeasurement
        FROM babies b
        LEFT JOIN measurements m ON b.id = m.babyId
        WHERE b.status = 'Aktif'
        GROUP BY b.id
        ORDER BY b.createdAt DESC
    `, (err, babies) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, data: babies });
    });
});

app.post('/api/babies', authenticateToken, [
    body('nama').notEmpty().withMessage('Name is required'),
    body('tanggalLahir').isDate().withMessage('Valid birth date is required'),
    body('jenisKelamin').isIn(['Laki-laki', 'Perempuan']).withMessage('Gender must be Laki-laki or Perempuan'),
    body('namaOrtu').notEmpty().withMessage('Parent name is required'),
    body('noTelp').notEmpty().withMessage('Phone number is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nama, tanggalLahir, jenisKelamin, alamat, namaOrtu, noTelp } = req.body;

    db.run(`
        INSERT INTO babies (nama, tanggalLahir, jenisKelamin, alamat, namaOrtu, noTelp)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [nama, tanggalLahir, jenisKelamin, alamat, namaOrtu, noTelp], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.status(201).json({ 
            success: true, 
            message: 'Baby data created successfully',
            data: { id: this.lastID }
        });
    });
});

app.put('/api/babies/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { nama, tanggalLahir, jenisKelamin, alamat, namaOrtu, noTelp } = req.body;

    db.run(`
        UPDATE babies 
        SET nama = ?, tanggalLahir = ?, jenisKelamin = ?, alamat = ?, namaOrtu = ?, noTelp = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
    `, [nama, tanggalLahir, jenisKelamin, alamat, namaOrtu, noTelp, id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Baby not found' });
        }
        
        res.json({ success: true, message: 'Baby data updated successfully' });
    });
});

app.delete('/api/babies/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.run('UPDATE babies SET status = "Nonaktif" WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Baby not found' });
        }
        
        res.json({ success: true, message: 'Baby data deleted successfully' });
    });
});

// Measurements routes
app.get('/api/babies/:babyId/measurements', authenticateToken, (req, res) => {
    const { babyId } = req.params;

    db.all(`
        SELECT m.*, u.nama as petugasNama 
        FROM measurements m
        JOIN users u ON m.userId = u.id
        WHERE m.babyId = ?
        ORDER BY m.tanggalUkur DESC
    `, [babyId], (err, measurements) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, data: measurements });
    });
});

app.post('/api/measurements', authenticateToken, [
    body('babyId').isInt().withMessage('Baby ID is required'),
    body('berat').isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
    body('tinggi').isFloat({ min: 0 }).withMessage('Height must be a positive number')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { babyId, berat, tinggi, catatan } = req.body;
    const userId = req.user.id;

    // Determine status based on weight and height (simple logic)
    let status = 'Normal';
    if (berat < 5 || tinggi < 50) {
        status = 'Kurang';
    } else if (berat > 15 || tinggi > 90) {
        status = 'Berlebih';
    }

    db.run(`
        INSERT INTO measurements (babyId, userId, berat, tinggi, catatan, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [babyId, userId, berat, tinggi, catatan, status], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.status(201).json({ 
            success: true, 
            message: 'Measurement saved successfully',
            data: { id: this.lastID, status }
        });
    });
});

// Statistics endpoint
app.get('/api/statistics', authenticateToken, (req, res) => {
    const stats = {};

    // Get total babies
    db.get('SELECT COUNT(*) as total FROM babies WHERE status = "Aktif"', (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        stats.totalBabies = result.total;

        // Get total users
        db.get('SELECT COUNT(*) as total FROM users WHERE status = "Aktif"', (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            stats.totalUsers = result.total;

            // Get measurements today
            db.get(`
                SELECT COUNT(*) as total 
                FROM measurements 
                WHERE DATE(tanggalUkur) = DATE('now')
            `, (err, result) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                stats.measurementsToday = result.total;

                // Get measurements this month
                db.get(`
                    SELECT COUNT(*) as total 
                    FROM measurements 
                    WHERE strftime('%Y-%m', tanggalUkur) = strftime('%Y-%m', 'now')
                `, (err, result) => {
                    if (err) return res.status(500).json({ error: 'Database error' });
                    stats.measurementsThisMonth = result.total;

                    res.json({ success: true, data: stats });
                });
            });
        });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});

app.listen(PORT, () => {
    console.log(`🏥 Posyandu API Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📝 Default login: username=posyandu22, password=poltek23`);
});

module.exports = app;
