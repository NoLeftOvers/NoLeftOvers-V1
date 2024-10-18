const express = require('express');
const router = express.Router();
const pool = require('../db'); // pool 객체를 연결한 파일에서 불러와야 합니다;

/**
 * @swagger
 * /user:
 *   get:
 *     summary: 모든 유저 데이터를 조회합니다.
 *     description: 데이터베이스에서 모든 유저의 정보를 조회합니다.
 *     responses:
 *       200:
 *         description: 유저 데이터를 성공적으로 조회하였습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: 홍길동
 *                   nickName:
 *                     type: string
 *                     example: 길동이
 *                   school_number:
 *                     type: string
 *                     example: 2020123456
 *                   password:
 *                     type: string
 *                     example: hashed_password
 *                   points:
 *                     type: integer
 *                     example: 1200
 *       500:
 *         description: 서버 오류 - 유저 데이터를 불러오는 중 문제가 발생했습니다.
 */

// GET 요청: 모든 유저 데이터를 조회
router.get('/', (req, res) => {
    console.log('GET /user - Fetching all users');

    const sql = 'SELECT name, nickName, school_number, password, points FROM user';
    pool.query(sql, (err, results) => {
        if (err) {
            console.error(`GET /user - Error fetching users: ${err.message}`);
            return res.status(500).send('Error fetching users');
        }
        console.log('GET /user - Successfully fetched users');
        res.json(results);
    });
});

// GET 요청: 포인트 랭크를 조회
router.get('/rank', (req, res) => {
    console.log('GET /user/rank - Fetching user points ranking');

    const sql = 'SELECT name, nickName, school_number, points FROM user ORDER BY points DESC';
    pool.query(sql, (err, results) => {
        if (err) {
            console.error(`GET /user/rank - Error fetching user points ranking: ${err.message}`);
            return res.status(500).send('Error fetching user points ranking');
        }

        console.log('GET /user/rank - Successfully fetched user points ranking');
        res.json(results);
    });
});

// GET 요청: 유저별 포인트 리스트 데이터를 조회
router.get(`/point`, (req, res) => {
    const userId = req.query.userId;
    console.log('GET /user/point - Fetching points for user_id:', userId);

    const sql = 'SELECT point, description, created_at FROM point WHERE user_id = ? ORDER BY created_at DESC';
    pool.query(sql, [userId], (err, results) => {
        if (err) {
            console.error(`GET /user/point - Error fetching points for user_id: ${userId}, Error: ${err.message}`);
            return res.status(500).send('Error fetching user points');
        }
        console.log('GET /user/point - Successfully fetched points for user_id:', userId);
        res.json(results);
    });
});

module.exports = router;
