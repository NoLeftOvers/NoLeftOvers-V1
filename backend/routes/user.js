const express = require('express');
const router = express.Router();
const pool = require('../db'); // pool 객체를 연결한 파일에서 불러와야 합니다.

// POST 요청: 유저 데이터를 삽입
router.post('/users', (req, res) => {
    const { name, nickName, schoolNumber, password, point } = req.body;

    // 요청 데이터 로그
    console.log(`POST /users - Data received: ${JSON.stringify(req.body)}`);

    if (!name || !nickName || !schoolNumber || !password || point === undefined) {
        console.log('POST /users - Missing required fields');
        return res.status(400).send('Missing required fields');
    }

    // 유저 데이터를 데이터베이스에 삽입하는 SQL 쿼리
    const sql = 'INSERT INTO users (name, nickName, schoolNumber, password, point) VALUES (?, ?, ?, ?, ?)';
    pool.query(sql, [name, nickName, schoolNumber, password, point], (err, results) => {
        if (err) {
            console.error(`POST /users - Error inserting user: ${err.message}`);
            return res.status(500).send('Error inserting user');
        }
        console.log('POST /users - User added successfully');
        res.send('User added successfully');
    });
});

// GET 요청: 모든 유저 데이터를 조회
router.get('/users', (req, res) => {
    console.log('GET /users - Fetching all users');

    // 모든 유저 데이터를 조회하는 SQL 쿼리
    const sql = 'SELECT name, nickName, schoolNumber, password, point FROM users';
    pool.query(sql, (err, results) => {
        if (err) {
            console.error(`GET /users - Error fetching users: ${err.message}`);
            return res.status(500).send('Error fetching users');
        }
        console.log('GET /users - Successfully fetched users');
        res.json(results); // 조회된 결과를 JSON 형식으로 클라이언트에게 반환
    });
});

module.exports = router;
