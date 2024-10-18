const express = require('express');
const cors = require('cors');
const app = express();
const menuRoutes = require('./routes/menu');
const userRoutes = require('./routes/user');
const pointRoutes = require('./routes/point');
const imageRoutes = require('./routes/image');

require('dotenv').config();
const { swaggerUi, specs } = require('./swagger/swagger');

// CORS 설정
const whitelist = ['http://localhost:3000'];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true); // CORS 허용
        } else {
            callback(new Error('Not Allowed Origin!')); // CORS 비허용
        }
    },
};

// 미들웨어 설정
app.use(cors(corsOptions));
app.use(express.json()); // 요청 body를 JSON으로 파싱

// API 라우트 설정
app.use('/api/user', userRoutes); // /api/user/~ 경로로 유저 라우트를 설정
app.use('/api/point', pointRoutes); // /api/point/~ 경로로 포인트 라우트를 설정
app.use('/api/menu', menuRoutes); // /api/menu/~ 경로로 식단 라우트를 설정
app.use('/api/image', imageRoutes); // /api/image/~ 경로로 이미지 라우트를 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @path {GET} http://13.209.118.89:8000
 * @description 요청 데이터 값이 없고 반환 값이 있는 GET Method
 */

// 포트 설정 및 서버 실행
const port = 8000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack); // 에러 스택을 로그로 출력
    res.status(500).send('Something went wrong!');
});
