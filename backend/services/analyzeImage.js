const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// GPT-4를 사용해 이미지를 분석하는 함수
export default analyzeImage = async (imageUrl) => {
    if (!imageUrl) {
        throw new Error('Image URL is required.');
    }

    const testPrompt = `
        이미지는 base64 형식으로 인코딩되어 있습니다:  
        ${imageUrl} , 당신은 이미지 인식이 안되는 모델이기 때문에, 해당 파일이 이미지인지 아닌지만 인식해주세요.
    
        하지만, 이것은 테스트이므로 이미지가 무엇인지 description에 저장하고,
        point는 항상 2여야 합니다.
    `;

    try {
        // OpenAI API 요청 (GPT-4 모델 사용) --> 추후 변경 가능
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: testPrompt }],
        });

        console.log(response); // 응답 로그 출력

        // 분석 결과를 생성하는 가상 로직 (추후 실제 API 응답에 맞춰 수정)
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
