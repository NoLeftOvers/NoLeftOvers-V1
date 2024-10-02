const express = require('express');
const router = express.Router();
const pool = require('../db'); // pool 객체를 연결한 파일에서 불러와야 합니다.

/**
 * @swagger
 * tags:
 *   name: User
 *   description: 유저 추가 수정 삭제 조회
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: 새로운 유저를 등록합니다.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 유저 이름
 *                 example: 홍길동
 *               nickName:
 *                 type: string
 *                 description: 유저 닉네임
 *                 example: 홍짱
 *               schoolNumber:
 *                 type: string
 *                 description: 유저의 학번
 *                 example: 20211234
 *               password:
 *                 type: string
 *                 description: 유저 비밀번호
 *                 example: password123
 *     responses:
 *       200:
 *         description: 유저가 성공적으로 등록되었습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'User added successfully'
 *       400:
 *         description: 필수 필드 누락으로 인해 요청이 실패했습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Missing required fields'
 *       500:
 *         description: 서버 오류로 인해 유저 추가에 실패했습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Error inserting user'
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: 모든 유저 데이터를 조회합니다.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: 유저 데이터가 성공적으로 조회되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: 유저 이름
 *                     example: 홍길동
 *                   nickName:
 *                     type: string
 *                     description: 유저 닉네임
 *                     example: 홍짱
 *                   school_number:
 *                     type: string
 *                     description: 유저의 학번
 *                     example: 20211234
 *                   password:
 *                     type: string
 *                     description: 유저 비밀번호
 *                     example: password123
 *                   points:
 *                     type: integer
 *                     description: 유저 포인트
 *                     example: 150
 *       500:
 *         description: 서버 오류로 인해 유저 데이터를 가져올 수 없습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Error fetching users'
 */

/**
 * @swagger
 * /user/rank:
 *   get:
 *     summary: 포인트 랭킹을 조회합니다.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: 유저 포인트 랭킹이 성공적으로 조회되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: 유저 이름
 *                     example: 홍길동
 *                   nickName:
 *                     type: string
 *                     description: 유저 닉네임
 *                     example: 홍짱
 *                   school_number:
 *                     type: string
 *                     description: 유저의 학번
 *                     example: 20211234
 *                   points:
 *                     type: integer
 *                     description: 유저 포인트
 *                     example: 150
 *       500:
 *         description: 서버 오류로 인해 포인트 랭킹 조회에 실패했습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Error fetching user points ranking'
 */

/**
 * @swagger
 * /user/point:
 *   get:
 *     summary: 특정 유저의 포인트 리스트를 조회합니다.
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 유저의 ID
 *         example: 1
 *     responses:
 *       200:
 *         description: 유저 포인트 리스트가 성공적으로 조회되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: 유저 ID
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: 유저 이름
 *                     example: 홍길동
 *                   nickName:
 *                     type: string
 *                     description: 유저 닉네임
 *                     example: 홍짱
 *                   school_number:
 *                     type: string
 *                     description: 유저의 학번
 *                     example: 20211234
 *                   points:
 *                     type: integer
 *                     description: 유저 포인트
 *                     example: 150
 *       500:
 *         description: 서버 오류로 인해 유저 포인트 리스트 조회에 실패했습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Error fetching user points'
 */

// POST 요청: 유저 데이터를 삽입
router.post('/register', (req, res) => {
    const { name, nickName, schoolNumber, password } = req.body;

    console.log(`POST /user/register' - Data received: ${JSON.stringify(req.body)}`);

    if (!name || !nickName || !schoolNumber || !password) {
        console.log('POST /user/register - Missing required fields');
        return res.status(400).send('Missing required fields');
    }

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
    console.log('GET /user/point - Fetching all users');

    const sql = 'SELECT id, name, nickName, school_number, points FROM user WHERE id = ?';

    pool.query(sql, [userId], (err, results) => {
        if (err) {
            console.error(`GET /user/point - Error fetching points for user_id: ${userId}, Error: ${err.message}`);
            return res.status(500).send('Error fetching user points');
        }
        console.log('GET /user/point - Successfully fetched users');
        res.json(results);
    });
});

module.exports = router;
