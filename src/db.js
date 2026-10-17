const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'backend_uts',
    password: 'Asyraf240987',
    port: 5432
});

pool.query('SELECT NOW()')
    .then(result => {
        console.log('KONEKSI DATABASE BERHASIL!');
        console.log(result.rows[0]);
    })
    .catch(err => {
        console.error('KONEKSI DATABASE GAGAL:', err.message);
    });

module.exports = pool;