const express = require('express');
const router = express.Router();
const pool = require('../db'); // pool 객체를 연결한 파일에서 불러와야 합니다.

/**
 * @swagger
 * tags:
 *   name: image
 *   description: 이미지 업로드 및 GPT image 기능
 */

/**
 * @swagger
 * /image/upload:
 *   post:
 *     summary: 유저의 사진을 서버에 업로드합니다.
 *     tags: [Image]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *                 description: 유저의 아이이디
 *                 example: 1
 *               base64:
 *                 type: string
 *                 description: 이미지 파일의 base64 코드
 *                 example: dkfjkdjfl213dfakbgjhl2
 *     responses:
 *       200:
 *         description: 사진이 성공적으로 추가되었습니다.
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
 *         description: 서버 오류로 인해 샤진 추가에 실패했습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Error inserting user'
 */

// POST 요청: 포인트 데이터를 삽입
router.post('/upload', (req, res) => {
    const { userId, base64 } = req.body;

    // 요청 데이터 로그
    console.log(`POST /image/upload - Data received: ${JSON.stringify(req.body)}`);

    if (!userId || !base64 || !description) {
        console.log('POST /image/upload - Missing required fields');
        return res.status(400).send('Missing required fields');
    }

    // 포인트 데이터를 데이터베이스에 삽입하는 SQL 쿼리
    const sql = 'INSERT INTO image (user_id, base64) VALUES (?, ?, ?)';
    pool.query(sql, [userId, base64], (err, results) => {
        if (err) {
            console.error(`POST /image/upload - Error inserting user: ${err.message}`);
            return res.status(500).send('Error inserting user');
        }
        console.log('POST /image/upload - Image uploaded successfully');
        res.send('Image uploaded successfully');
    });
});

module.exports = router;
