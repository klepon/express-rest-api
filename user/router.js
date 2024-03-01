const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database/pool.js')
require('dotenv').config();

const router = express.Router();

// Fungsi untuk menangani kesalahan
function handleErrors(error, res, resCode) {
  // Mendapatkan informasi kesalahan
  const errorCode = error.code || 500;
  const errorSeverity = error.severity || 'ERROR';
  const errorDetail = error.detail || 'Internal Server Error';
  
  // Mengirim respons sesuai dengan format yang ditentukan
  res.status(resCode).json({
    error: {
      code: errorCode,
      severity: errorSeverity,
      detail: errorDetail
    }
  });
}

// Endpoint untuk registrasi pengguna baru
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (name, email, username, password, role) VALUES ($1, $2, $3, $4, $5)';
    await pool.query(query, [name, email, username, hashedPassword, 'user']);
    res.status(201).send('User registered successfully');
  } catch (error) {
    handleErrors(error, res, 500)
  }
});

// Endpoint untuk autentikasi pengguna
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(404).send('Invalid user or password');
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).send('Invalid user or password');
    }

    const token = jwt.sign({ username: user.username }, process.env.LOGIN_JWT_SECRET);
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Middleware untuk verifikasi token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access denied');

  jwt.verify(token, process.env.LOGIN_JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
}

// Contoh penggunaan autentikasi untuk mendapatkan data pengguna terotentikasi
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [req.user.username]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;