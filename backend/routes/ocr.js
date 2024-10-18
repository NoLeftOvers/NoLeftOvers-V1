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

// POST 요청: GPT-4를 통해 이미지 분석
router.post('/', async (req, res) => {
    // 필수 데이터 확인
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).send({ error: 'Image URL is required.' });
    }

    try {
        const testPrompt = `
            이미지는 base64 형식으로 인코딩되어 있습니다:  
            ${imageUrl} , 당신은 이미지 인식이 안되는 모델이기 때문에, 해당 파일이 이미지인지 아닌지만 인식해주세요.
        
            하지만, 이것은 테스트이므로 이미지가 무엇인지 description에 저장하고,
            point는 항상 2여야 합니다.
        `;

        // OpenAI API 요청 (GPT-4 모델 사용) --> 추후 변경
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
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

        // 성공적으로 분석한 결과를 클라이언트에게 반환함
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
