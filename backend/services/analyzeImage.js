const OpenAI = require('openai');
const fetch = require('node-fetch');
const sharp = require('sharp');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// GPT-4를 사용해 이미지를 분석하는 함수
const analyzeImage = async (imageUrl) => {
    if (!imageUrl) {
        throw new Error('Image URL is required.');
    }

    // URL에서 이미지를 다운로드하고 크기 축소 후 base64로 인코딩
    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error('Failed to download image');
    }
    const buffer = await response.arrayBuffer();

    // Sharp를 사용하여 이미지 크기 축소 및 변환
    const resizedImageBuffer = await sharp(Buffer.from(buffer))
        .resize(500) // 예: 너비를 500px로 조정 (크기 조정)
        .jpeg({ quality: 70 }) // JPEG 압축 품질 설정
        .toBuffer();

    const base64Image = resizedImageBuffer.toString('base64');
    console.log('Image downloaded, resized, and converted to base64 successfully.');

    // 이미지 분석 프롬프트 작성
    const imageAnalysisPrompt = `
  주어진 식판 이미지를 보고 다음 정보를 추정해주세요:
    - description: 남은 음식물의 양에 따라 자연스럽게 칭찬하거나 꾸짖는 톤으로 30자 내외로 평가  (예: 남긴 게 적으면 "와, 정말 깔끔하게 드셨네요!", 많이 남기면 "이게 다 먹은 거에요?"와 같은 표현)
    - leftSection: 식판에서 남은 음식물 구역 수 (0에서 5 사이의 정수로, 0이 남은 게 없는 상태)
    - point: 남은 음식물이 적을수록 높은 점수로 20에서 -1 사이로 평가

`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: '당신은 이미지 분석을 도와주는 사람입니다. 한국어로 답하세요' },
                { role: 'user', content: `${imageAnalysisPrompt} 이미지 데이터: ${base64Image}` },
            ],
            max_tokens: 100,
        });

        // API 응답 확인 및 파싱
        const content = response.choices[0].message.content;
        console.log('API Response:', content);

        // 문자열에서 데이터를 직접 추출
        const descriptionMatch = content.match(/description: ([^\n]*)/);
        const leftSectionMatch = content.match(/leftSection: (\d+)/);
        const pointMatch = content.match(/point: (-?\d+)/);

        const description = descriptionMatch ? descriptionMatch[1].trim() : 'No description provided';
        const leftSection = leftSectionMatch ? parseInt(leftSectionMatch[1], 10) : null;
        const point = pointMatch ? parseInt(pointMatch[1], 10) : null;

        return {
            description,
            leftSection,
            point,
        };
    } catch (error) {
        console.error('Error analyzing image:', error.message);
        throw new Error('Failed to analyze image');
    }
};

module.exports = { analyzeImage };
