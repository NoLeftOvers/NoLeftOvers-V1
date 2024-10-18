const express = require('express');
const router = express.Router();
const userModel = require('../model/userModel'); // userModel 불러오기
const { generateToken } = require('../services/jwt'); // jwt 토큰 생성 파일 불러오기
const bcrypt = require('bcrypt');

// POST 요청: 유저 등록 (회원가입)
router.post('/register', async (req, res) => {
    const { name, nickName, schoolNumber, password } = req.body;

    console.log(`POST /auth/register' - Data received: ${JSON.stringify(req.body)}`);

    if (!name || !nickName || !schoolNumber || !password) {
        console.log('POST /auth/register - Missing required fields');
        return res.status(400).send('Missing required fields');
    }
    try {
        // 비밀번호 해시
        const hashedPassword = await bcrypt.hash(password, 10);

        // 유저 등록 처리 (모델 사용)
        await userModel.createUser({ name, nickName, schoolNumber, password: hashedPassword });

        console.log('POST /auth/register - User added successfully');
        res.status(201).send('회원가입이 성공적으로 완료되었습니다.');
    } catch (err) {
        console.error(`POST /auth/register - Error inserting user: ${err.message}`);
        res.status(500).send('회원가입 중 오류가 발생했습니다.');
    }
});

// POST 요청: 로그인
router.post('/login', async (req, res) => {
    const { schoolNumber, password } = req.body;

    // 아이디로 해당 유저 검색
    const user = await userModel.findUserBySchoolNumber(schoolNumber);

    // 아이디가 db에 없을 경우 에러 메세지 전송
    if (!user) {
        throw new Error('가입되지 않은 아이디 입니다.');
    }

    // 비밀번호 일치 여부 확인
    const isMatched = await bcrypt.compare(password, user.password);

    // 일치하지 않을 경우 에러 메세지 전송
    if (!isMatched) {
        throw new Error('비밀번호가 일치하지 않습니다.');
    }

    // 유저 id  페이로드 정보 생성
    const payload = {
        schoolNumber: user.schoolNumber,
    };

    // jwt.js에서 작성된 토큰 생성 코드 실행
    const token = generateToken(payload);
    // 'token' 이라는 쿠키 이름으로 토큰 저장, 'httpOnly' 옵션으로 접근 보호
    // 'maxAge' 옵션을 3600000(1시간, 밀리초) 설정
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
    res.json({ message: '성공적으로 로그인 되었습니다.', user, token });
});

module.exports = router;
