const OpenAI = require('openai');
const express = require('express');
const sharp = require('sharp');
const router = express.Router();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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
 *     summary: 유저의 사진을 GPT-4 모델로 전송하여 분석합니다.
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
 *                 description: 유저의 아이디
 *                 example: 1
 *               base64:
 *                 type: string
 *                 description: 이미지 파일의 base64 코드
 *                 example: dkfjkdjfl213dfakbgjhl2
 *     responses:
 *       200:
 *         description: 사진이 성공적으로 분석되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Image uploaded and analyzed successfully'
 *                 analysisResult:
 *                   type: object
 *                   description: 분석 결과
 *       400:
 *         description: 필수 필드 누락으로 인해 요청이 실패했습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Missing required fields'
 *       500:
 *         description: 서버 오류로 인해 사진 분석에 실패했습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Error analyzing image'
 */

// base64 문자열을 버퍼로 변환
function base64ToBuffer(base64) {
    return Buffer.from(base64, 'base64');
}

// 버퍼를 base64로 변환
function bufferToBase64(buffer) {
    return buffer.toString('base64');
}

// POST 요청: GPT-4를 통해 이미지 분석
router.post('/upload', async (req, res) => {
    const { userId, base64 } = req.body;

    // 필수 데이터 확인
    if (!userId || !base64) {
        console.log('POST /image/upload - Missing required fields');
        return res.status(400).send('Missing required fields');
    }

    try {
        // base64 데이터를 버퍼로 변환
        const imageBuffer = base64ToBuffer(base64);

        // sharp을 사용하여 이미지를 리사이징하고 압축
        const compressedImageBuffer = await sharp(imageBuffer)
            .resize({ width: 300 }) // 이미지를 300px 너비로 리사이징
            .jpeg({ quality: 80 }) // JPEG 형식으로 압축 (품질 80%)
            .toBuffer();

        // 압축된 이미지를 base64로 변환
        const compressedBase64 = bufferToBase64(compressedImageBuffer);

        // GPT-4 모델에게 이미지를 분석하는 프롬프트 생성
        // const prompt = `
        // 당신에게 5개의 칸이 있는 식판 이미지가 주어졌습니다.
        // 이미지를 분석하여 몇 개의 칸에 음식이 남아있는지 확인하세요.
        // 0에서 4까지의 숫자로 응답해주세요.
        // 여기서:
        // - 0은 남은 음식이 없는 경우,
        // - 4는 모든 칸에 음식이 남아있는 경우를 의미합니다.

        // 이미지는 base64 형식으로 인코딩되어 있습니다:
        // ${compressedBase64}
        // `;

        const testPrompt = `
            이미지는 base64 형식으로 인코딩되어 있습니다:  
            ${compressedBase64} , 당신은 이미지 인식이 안되는 모델이기 때문에, 해당 파일이 이미지인지 아닌지만 인식해주세요.
        
            하지만, 이것은 테스트이므로 이미지가 무엇인지 description에 저장하고,
            point는 항상 2여야 합니다.
        `;

        // OpenAI API 요청 (GPT-4o 모델 사용)
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: testPrompt }],
        });
        console.log(response);

        let description = '식판 분석 테스트'; // description 변수 선언
        let leftSection = 2; // leftSection 변수 선언

        // 잔반 수에 따른 점수 계산
        let point = 0;
        if (leftSection === 0) point = 20;
        else if (leftSection === 1) point = 15;
        else if (leftSection === 2) point = 10;
        else if (leftSection === 3) point = 5;
        else if (leftSection === 4) point = 0;
        else if (leftSection === 5) point = -1;

        // 성공적으로 분석한 결과를 클라이언트에게 반환
        res.json({
            message: 'Image uploaded and analyzed successfully',
            analysisResult: {
                leftSection,
                point,
                description,
            },
        });
    } catch (error) {
        console.error('Error analyzing image:', error);
        res.status(500).json({ error: 'Failed to analyze image' });
    }
});

module.exports = router;
