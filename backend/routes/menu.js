const express = require('express');
const router = express.Router();
const pool = require('../db'); // pool 객체를 연결한 파일에서 불러와야 합니다.

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: 메뉴 관련
 */

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: 오늘의 식단 정보를 가져옵니다.
 *     tags: [Menu]
 *     parameters:
 *       - in: query
 *         name: restaurantType
 *         schema:
 *           type: string
 *           enum: [gyo, bi, gick]
 *         required: true
 *         description: 식당의 종류 (gyo, bi, gick 중 하나)
 *     responses:
 *       200:
 *         description: 오늘의 식단 정보를 가져옵니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   restaurant_type:
 *                     type: string
 *                     description: 식당 종류
 *                     example: gyo
 *                   day_of_week:
 *                     type: string
 *                     description: 요일
 *                     example: Monday
 *                   meal_time:
 *                     type: string
 *                     description: 식사 시간 (아침, 점심, 저녁 등)
 *                     example: lunch
 *                   dishes:
 *                     type: string
 *                     description: 제공되는 요리 목록
 *                     example: 불고기, 비빔밥
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: 식단 날짜
 *                     example: 2024-10-01
 *       500:
 *         description: 서버 오류로 인해 식단 정보를 가져올 수 없습니다.
 */

// GET 요청: 오늘 식단 정보를 요청
router.get('/', (req, res) => {
    const restaurantType = req.query.restaurantType;
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
    // type 은 gyo, bi, gick 3가지 식당으로
    console.log('GET /menu - Fetching all menus');

    // 모든 식당별 오늘 식단 데이터를 조회하는 SQL 쿼리
    const sql =
        'SELECT restaurant_type, day_of_week, meal_time, dishes, date FROM menu WHERE restaurant_type = ? AND date = ?';
    pool.query(sql, [restaurantType, date], (err, results) => {
        if (err) {
            console.error(`GET /menu - Error fetching menus: ${err.message}`);
            return res.status(500).send('Error fetching menus');
        }
        console.log('GET /menu - Successfully fetched menus');
        res.json(results); // 조회된 결과를 JSON 형식으로 클라이언트에게 반환
    });
});

module.exports = router;
