const express = require('express');
const router = express.Router();
const pool = require('../db'); // pool 객체를 연결한 파일에서 불러와야 합니다.

// POST 요청: 포인트 데이터를 삽입
router.post('/add', (req, res) => {
    const { user_id, point, description } = req.body;

    // 요청 데이터 로그
    console.log(`POST /point/add - Data received: ${JSON.stringify(req.body)}`);

    if (!user_id || !point || !description) {
        console.log('POST /point/add - Missing required fields');
        return res.status(400).send('Missing required fields');
    }

    // 포인트 데이터를 데이터베이스에 삽입하는 SQL 쿼리
    const sql = 'INSERT INTO point (user_id, point, description) VALUES (?, ?, ?)';
    pool.query(sql, [user_id, point, description], (err, results) => {
        if (err) {
            console.error(`POST /point/add - Error inserting user: ${err.message}`);
            return res.status(500).send('Error inserting user');
        }
        console.log('POST /point/add - User added successfully');
        res.send('Point added successfully');
    });
});

module.exports = router;
