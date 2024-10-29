const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// GPT-4를 사용해 이미지를 분석하는 함수
const analyzeImage = async (imageUrl) => {
    console.log('analyzeImage function loaded');

    if (!imageUrl) {
        throw new Error('Image URL is required.');
    }

    const prompt = `
        ${imageUrl}  이미지는 식판 이미지로, 5개의 구역이 있습니다.
        각 구역에 음식물이 남아 있는지 판단하여 "leftSection" 변수에 남은 음식이 있는 구역 수를 정수로 반환해 주세요.
        테스트 목적으로 이 이미지를 분석하여 간단한 설명을 'description'에 작성하고,
        'point' 값은 다음 규칙을 따릅니다:

        남은 음식이 없는 경우 point = 20
        1개의 구역에만 남은 경우 point = 15
        2개의 구역에 남은 경우 point = 10
        3개의 구역에 남은 경우 point = 5
        4개의 구역에 남은 경우 point = 0
        
        예를 들어, "leftSection": 2, "description": "식판에 2개의 음식물 구역이 남음"과 같이 응답해 주세요.
        이미지는 url 형식으로 인코딩되어 있습니다:  
    `;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
        });

        console.log(response); // 응답 로그 출력

        // 잔반 수에 따른 점수 계산
        let point = 0;
        if (leftSection === 0) point = 20;
        else if (leftSection === 1) point = 15;
        else if (leftSection === 2) point = 10;
        else if (leftSection === 3) point = 5;
        else if (leftSection === 4) point = 0;
        else if (leftSection === 5) point = -1;

        // 결과 반환
        return {
            leftSection,
            point,
            description,
        };
    } catch (error) {
        console.error('Error analyzing image:', error);
        throw new Error('Failed to analyze image');
    }
};

module.exports = { analyzeImage };
