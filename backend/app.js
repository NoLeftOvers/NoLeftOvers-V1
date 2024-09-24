const express = require('express');
const app = express();
const userRoutes = require('./routes/user');
const indexRoutes = require('./routes/index'); // 홈 라우트 추가

app.use(express.json());

// 기본 경로 설정
app.use('/', indexRoutes);
// 유저 라우트 설정
app.use('/api', userRoutes); // /api/users 경로로 유저 라우트를 설정

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
