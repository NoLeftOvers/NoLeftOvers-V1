const express = require('express');
const router = express.Router();
const pool = require('../db'); // pool 객체를 연결한 파일에서 불러와야 합니다.

// POST 요청: 유저 데이터를 삽입
router.post('/register', (req, res) => {
    const { name, nickName, schoolNumber, password } = req.body;

    // 요청 데이터 로그
    console.log(`POST /user/register' - Data received: ${JSON.stringify(req.body)}`);

    if (!name || !nickName || !schoolNumber || !password) {
        console.log('POST /user/register - Missing required fields');
        return res.status(400).send('Missing required fields');
    }

    // 유저 데이터를 데이터베이스에 삽입하는 SQL 쿼리
    const sql = 'INSERT INTO user (name, nickName, school_number, password) VALUES (?, ?, ?, ?)';
    pool.query(sql, [name, nickName, schoolNumber, password], (err, results) => {
        if (err) {
            console.error(`POST /user/register - Error inserting user: ${err.message}`);
            return res.status(500).send('Error inserting user');
        }
        console.log('POST /user/register - User added successfully');
        res.send('User added successfully');
    });
});

// GET 요청: 모든 유저 데이터를 조회
router.get('/', (req, res) => {
    console.log('GET /user - Fetching all users');

    // 모든 유저 데이터를 조회하는 SQL 쿼리
    const sql = 'SELECT name, nickName, school_number, password, points FROM user';
    pool.query(sql, (err, results) => {
        if (err) {
            console.error(`GET /user - Error fetching users: ${err.message}`);
            return res.status(500).send('Error fetching users');
        }
        console.log('GET /user - Successfully fetched users');
        res.json(results); // 조회된 결과를 JSON 형식으로 클라이언트에게 반환
    });
});

// GET 요청: 포인트 랭크를 조회
router.get('/rank', (req, res) => {
    console.log('GET /user/rank - Fetching user points ranking');

    // 포인트 기준으로 내림차순 정렬하여 모든 유저 데이터를 조회하는 SQL 쿼리
    const sql = 'SELECT name, nickName, school_number, points FROM user ORDER BY points DESC';

    pool.query(sql, (err, results) => {
        if (err) {
            console.error(`GET /user/rank - Error fetching user points ranking: ${err.message}`);
            return res.status(500).send('Error fetching user points ranking');
        }

        console.log('GET /user/rank - Successfully fetched user points ranking');
        res.json(results); // 조회된 결과를 JSON 형식으로 클라이언트에게 반환
    });
});

// GET 요청: 유저별 포인트 리스트 데이터를 조회
router.get(`/point`, (req, res) => {
    const userId = req.query.userId;
    console.log('GET /user/point - Fetching all users');

    // 유저의 포인트 리스트를 조회하는 SQL 쿼리
    const sql = 'SELECT id, name, nickName, school_number, points FROM user WHERE id = ?';

    pool.query(sql, [userId], (err, results) => {
        if (err) {
            console.error(`GET /user/point - Error fetching points for user_id: ${userId}, Error: ${err.message}`);
            return res.status(500).send('Error fetching user points');
        }
        console.log('GET /user/point - Successfully fetched users');
        res.json(results); // 조회된 결과를 JSON 형식으로 클라이언트에게 반환
    });
});

module.exports = router;
