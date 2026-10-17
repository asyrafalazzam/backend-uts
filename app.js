const express = require('express');
const pool = require('./src/db');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// GET /
app.get('/', (req, res) => {
    res.send('Hello Backend!');
});

// GET /api
app.get('/api', (req, res) => {
    res.json({
        message: 'REST API Pertama'
    });
});

// GET /students
app.get('/students', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM students ORDER BY id'
        );

        res.json(result.rows);

    } catch (err) {
        console.error('Error PostgreSQL:', err);

        res.status(500).json({
            message: 'Gagal mengambil data siswa'
        });
    }
});

// GET /students/:id/:kelas
app.get('/students/:id/:kelas', async (req, res) => {
    const { id, kelas } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM students WHERE id = $1 AND kelas = $2',
            [id, kelas]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Siswa tidak ditemukan'
            });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Terjadi kesalahan server'
        });
    }
});

// GET /students/:id
app.get('/students/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM students WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Siswa tidak ditemukan'
            });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Terjadi kesalahan server'
        });
    }
});

// POST /students
app.post('/students', async (req, res) => {
    const { nama, kelas } = req.body;

    if (!nama || !kelas) {
        return res.status(400).json({
            message: 'Nama dan kelas wajib diisi'
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO students (nama, kelas)
             VALUES ($1, $2)
             RETURNING *`,
            [nama, kelas]
        );

        res.status(201).json({
            message: 'Siswa berhasil ditambahkan',
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Gagal menambahkan siswa'
        });
    }
});

// PUT /students/:id
app.put('/students/:id', async (req, res) => {
    const { id } = req.params;
    const { nama, kelas } = req.body;

    if (!nama || !kelas) {
        return res.status(400).json({
            message: 'Nama dan kelas wajib diisi'
        });
    }

    try {
        const result = await pool.query(
            `UPDATE students
             SET nama = $1, kelas = $2
             WHERE id = $3
             RETURNING *`,
            [nama, kelas, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Siswa tidak ditemukan'
            });
        }

        res.json({
            message: 'Data siswa berhasil diubah',
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Gagal mengubah data siswa'
        });
    }
});

// DELETE /students/:id
app.delete('/students/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM students WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Siswa tidak ditemukan'
            });
        }

        res.json({
            message: 'Data siswa berhasil dihapus',
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Gagal menghapus data siswa'
        });
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});