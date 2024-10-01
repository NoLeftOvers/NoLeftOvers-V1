const express = require('express');
const router = express.Router();
const pool = require('../db'); // pool 객체를 연결한 파일에서 불러와야 합니다.

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
