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
    point: number;
    description: string;
}

export const getOcr = async (file: object, userId: number) => {
    const token = Cookies.get('token');
    try {
        const response = await axios.post<GetOcrResponse>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/image/upload`,
            { file },
            {
                // headers를 두 번째 인자로 전달
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`, // 인증 토큰을 헤더에 포함
                },
            },
        );
        console.log(response);
        const { point, description } = response.data;
        getPoint(point, userId, description);
    } catch (error) {
        console.error('Error in OCR processing:', error);
    }
};
