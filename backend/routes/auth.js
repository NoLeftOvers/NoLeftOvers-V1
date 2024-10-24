const express = require('express');
const router = express.Router();
const userModel = require('../model/userModel'); // userModel 불러오기
const { generateToken } = require('../services/jwt'); // jwt 토큰 생성 파일 불러오기
const bcrypt = require('bcrypt');
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: "회원가입을 처리합니다."
 *     description: "유저 정보를 받아 회원가입을 진행합니다."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "홍길동"
 *               nickName:
 *                 type: string
 *                 example: "gildong"
 *               schoolNumber:
 *                 type: string
 *                 example: "20231234"
 *               password:
 *                 type: string
 *                 example: "password123"
 *             required:
 *               - name
 *               - nickName
 *               - schoolNumber
 *               - password
 *     responses:
 *       201:
 *         description: "회원가입 성공"
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "회원가입이 성공적으로 완료되었습니다."
 *       400:
 *         description: "필수 정보 누락 또는 학번 중복으로 인해 회원가입 실패"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이미 등록된 학번입니다."
 *       500:
 *         description: "서버 오류로 인해 회원가입 중 문제가 발생했습니다."
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "회원가입 중 오류가 발생했습니다."
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: "유저 로그인을 처리합니다."
 *     description: "유저의 학번과 비밀번호를 받아 로그인 처리 후 JWT 토큰을 발급합니다."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolNumber:
 *                 type: string
 *                 example: "20231234"
 *               password:
 *                 type: string
 *                 example: "password123"
 *             required:
 *               - schoolNumber
 *               - password
 *     responses:
 *       200:
 *         description: "로그인 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "성공적으로 로그인 되었습니다."
 *                 user:
 *                   type: object
 *                   properties:
 *                     schoolNumber:
 *                       type: string
 *                       example: "20231234"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: "아이디가 존재하지 않거나 비밀번호가 일치하지 않습니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "가입되지 않은 아이디 입니다."
 *       401:
 *         description: "비밀번호 불일치"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "비밀번호가 일치하지 않습니다."
 *       500:
 *         description: "서버 오류로 인해 로그인 중 문제가 발생했습니다."
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "로그인 중 오류가 발생했습니다."
 */

/// POST 요청: 유저 등록 (회원가입)
router.post('/register', async (req, res) => {
    const { name, nickName, schoolNumber, password } = req.body;

    console.log(`POST /auth/register' - Data received: ${JSON.stringify(req.body)}`);

    if (!name || !nickName || !schoolNumber || !password) {
        console.log('POST /auth/register - Missing required fields');
        return res.status(400).send('Missing required fields');
    }

    try {
        // schoolNumber 중복 여부 확인
        const existingUser = await userModel.findUserBySchoolNumber(schoolNumber);

        if (existingUser) {
            console.log(`POST /auth/register - Duplicate schoolNumber: ${schoolNumber}`);
            return res.status(400).json({ message: '이미 등록된 학번입니다.' });
        }

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

    try {
        // 아이디로 해당 유저 검색
        const user = await userModel.findUserBySchoolNumber(schoolNumber);

        // 아이디가 db에 없을 경우 에러 메시지 전송
        if (!user) {
            return res.status(400).json({ message: '가입되지 않은 아이디 입니다.' });
        }

        // 일치하지 않을 경우 에러 메시지 전송
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            console.log('비밀번호 불일치:', password, user.password);
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
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
    } catch (err) {
        console.error(`POST /auth/login - Error: ${err.message}`);
        res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
    }
});

module.exports = router;
