const express = require('express');
const router = express.Router();
const pool = require('../db'); // pool 객체를 연결한 파일에서 불러와야 합니다.

/**
 * @swagger
 * tags:
 *   name: Point
 *   description: 포인트 추가 및 조회
 */

/**
 * @swagger
 * /point/add:
 *   post:
 *     summary: 유저의 포인트를 추가합니다.
 *     tags: [Point]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: 유저의 ID
 *                 example: 123
 *               point:
 *                 type: number
 *                 description: 추가할 포인트 수치
 *                 example: 100
 *               description:
 *                 type: string
 *                 description: 포인트 추가에 대한 설명
 *                 example: '프로모션 참여 보상'
 *     responses:
 *       200:
 *         description: 포인트가 성공적으로 추가되었습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Point added successfully'
 *       400:
 *         description: 필수 필드 누락으로 인해 요청이 실패했습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Missing required fields'
 *       500:
 *         description: 서버 오류로 인해 포인트 추가에 실패했습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Error inserting user'
 */

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
