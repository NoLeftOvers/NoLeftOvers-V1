const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('GET / - Home route accessed'); // 홈 라우트 접근 로그 추가
    res.send('Hello, Express');
});

module.exports = router;
