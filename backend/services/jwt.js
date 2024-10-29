const jwt = require('jsonwebtoken'); // 설치한 모듈을 불러온다.
const secretKey = process.env.JWT_SECRET_KEY; // secretKey는 보안을 위해 일반적으로 .env 파일에 작성한다.

// JWT 토큰을 생성하는 함수
const generateToken = (payload) => {
    const token = jwt.sign(payload, secretKey, { expiresIn: '7d', algorithm: 'HS256' });
    return token;
};

// 기존 토큰을 사용하여 새로운 토큰을 생성하는 함수
const refreshToken = (token) => {
    try {
        // 기존 토큰의 유효성 검사 및 디코딩
        const decoded = jwt.verify(token, secretKey);

        // 새로운 페이로드 생성
        const payload = {
            userId: decoded.userId,
            isAdmin: decoded.isAdmin,
        };

        // 새로운 토큰 생성
        const newToken = generateToken(payload);
        return newToken;
    } catch (error) {
        // 토큰 새로 고침 중 오류 발생 시 출력
        console.error('Error refreshing token:', error);
        return null;
    }
};

// 토큰 검증 미들웨어
const authenticateToken = (req, res, next) => {
    // Authorization 헤더에서 토큰을 가져오고, 없으면 쿠키에서 가져옴
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer 토큰을 추출
    const cookieToken = req.cookies?.token;

    // 토큰이 없으면 에러 반환
    if (!token && !cookieToken) {
        return res.status(401).json({ error: '토큰이 없습니다.' });
    }

    try {
        // Authorization 헤더에 있는 토큰을 우선 사용하고, 없으면 쿠키에서 가져옴
        const validToken = token || cookieToken;
        const decoded = jwt.verify(validToken, secretKey); // 토큰 검증
        req.user = decoded; // 토큰에서 디코딩된 정보를 req.user에 저장
        next(); // 다음 미들웨어로 이동
    } catch (error) {
        return res.status(403).json({ error: '토큰이 유효하지 않습니다.' });
    }
};

module.exports = { generateToken, refreshToken, authenticateToken };
