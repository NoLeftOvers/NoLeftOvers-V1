import axios from 'axios';
import Cookies from 'js-cookie';

const getPoint = (point: number, userId: number, description: string) => {
    axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/point/add`, {
        point,
        userId,
        description,
    });
};

interface GetOcrResponse {
    ocrResult: {
        point: number;
        description: string;
        leftSection: number;
    };
}

// getOcr 함수가 응답 데이터를 반환하도록 수정
export const getOcr = async (file: object, userId: number) => {
    const token = Cookies.get('token');
    try {
        const response = await axios.post<GetOcrResponse>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/image/upload`,
            { file },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        const { point, description } = response.data.ocrResult;
        getPoint(point, userId, description);

        return { point, description }; // 반환값 추가
    } catch (error) {
        console.error('Error in OCR processing:', error);
        throw error; // 오류 발생 시 예외를 던집니다.
    }
};
