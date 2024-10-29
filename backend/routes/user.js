const express = require('express');
const router = express.Router();
const pool = require('../db'); // pool 객체를 연결한 파일에서 불러와야 합니다;
const { authenticateToken } = require('../services/jwt');

/**
 * @swagger
 * /user:
 *   get:
 *     summary: 모든 유저 데이터를 조회합니다.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: 성공적으로 유저 데이터를 가져왔습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "홍길동"
 *                   nickName:
 *                     type: string
 *                     example: "gildong123"
 *                   school_number:
 *                     type: string
 *                     example: "20231234"
 *                   password:
 *                     type: string
 *                     example: "$2b$10$..."
 *                   points:
 *                     type: number
 *                     example: 150
 *       500:
 *         description: 서버 오류로 인해 데이터를 가져오지 못했습니다.
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
 *     summary: 포인트 순으로 유저 랭킹을 조회합니다.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: 성공적으로 유저 포인트 랭킹을 가져왔습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "홍길동"
 *                   nickName:
 *                     type: string
 *                     example: "gildong123"
 *                   school_number:
 *                     type: string
 *                     example: "20231234"
 *                   points:
 *                     type: number
 *                     example: 150
 *       500:
 *         description: 서버 오류로 인해 데이터를 가져오지 못했습니다.
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
 *     summary: 특정 유저의 포인트 내역을 조회합니다.
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 조회할 유저의 ID
 *     responses:
 *       200:
 *         description: 성공적으로 유저의 포인트 내역을 가져왔습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nickName:
 *                   type: string
 *                   example: "gildong123"
 *                 totalPoints:
 *                   type: number
 *                   example: 150
 *                 pointHistory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       point:
 *                         type: number
 *                         example: 100
 *                       description:
 *                         type: string
 *                         example: "프로모션 참여 보상"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-23T18:25:43.511Z"
 *       400:
 *         description: 필수 파라미터가 누락되었습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Missing userId parameter'
 *       404:
 *         description: 유저를 찾을 수 없습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'User not found'
 *       500:
 *         description: 서버 오류로 인해 데이터를 가져오지 못했습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Error fetching user points'
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
router.get(`/point`, authenticateToken, (req, res) => {
    const userId = req.query.userId;
    console.log('GET /user/point - Fetching points for user_id:', userId);

    if (!userId) {
        return res.status(400).send('Missing userId parameter');
    }

    // 첫 번째 쿼리: user 테이블에서 nickName과 총 포인트 가져오기
    const userSql = 'SELECT nickName, points FROM user WHERE id = ?';

    pool.query(userSql, [userId], (err, userResults) => {
        if (err) {
            console.error(`GET /user/point - Error fetching user data for user_id: ${userId}, Error: ${err.message}`);
            return res.status(500).send('Error fetching user data');
        }

        if (userResults.length === 0) {
            return res.status(404).send('User not found');
        }

        const user = userResults[0]; // 사용자 정보 (nickName, points)

        // 두 번째 쿼리: point 테이블에서 포인트 항목들 가져오기
        const pointSql = 'SELECT point, description, created_at FROM point WHERE user_id = ? ORDER BY created_at DESC';

        pool.query(pointSql, [userId], (err, pointResults) => {
            if (err) {
                console.error(`GET /user/point - Error fetching points for user_id: ${userId}, Error: ${err.message}`);
                return res.status(500).send('Error fetching user points');
            }

            console.log('GET /user/point - Successfully fetched points for user_id:', userId);

            // 응답 데이터에 user 정보와 point 리스트 포함
            res.json({
                nickName: user.nickName,
                totalPoints: user.points,
                pointHistory: pointResults,
            });
        });
    });
});
module.exports = router;
