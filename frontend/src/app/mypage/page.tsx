'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface PointHistoryEntry {
    description: string;
    created_at: string; // 날짜를 string으로 정의
    point: number;
}

interface UserData {
    nickName: string;
    totalPoints: number;
    pointHistory: PointHistoryEntry[];
}

const UserProfile = () => {
    const [userData, setUserData] = useState<UserData>({
        nickName: '닉네임',
        totalPoints: 0,
        pointHistory: [],
    });
    const [loading, setLoading] = useState(true);

    // 쿠키에서 userId 가져오기
    const userId = Cookies.get('userId'); // 쿠키에 저장된 userId 가져오기

    useEffect(() => {
        const fetchUserData = async () => {
            const token = Cookies.get('token');
            if (!userId) {
                console.error('User ID not found in cookies');
                return;
            }

            try {
                const response = await axios.get<UserData>(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/user/point?userId=${userId}`,
                    {
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const { nickName, totalPoints, pointHistory } = userData;

    return (
        <div className="w-full p-4">
            {/* 닉네임 및 총 포인트 영역 */}
            <div className="mb-4 p-5 text-center bg-gray-300 rounded-lg shadow-md">
                <h2 className="font-bold text-lg mb-4">{nickName}님</h2>
                {/* 총 포인트 부분 */}
                <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 mt-6">
                    <div className="flex items-center space-x-2">
                        {/* 아이콘 자리 */}
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex justify-center items-center">
                            <span className="text-black text-xs">●</span>
                        </div>
                        <span className="font-bold text-gray-700">총 포인트</span>
                    </div>
                    <span className="text-blue-600 font-bold text-xl">{totalPoints}P</span>
                </div>
            </div>

            <br></br>
            {/* 포인트 내역 영역 */}
            <div>
                <h3 className="font-bold text-center text-lg mb-2">포인트 내역</h3>

                {loading ? (
                    <p>로딩 중...</p>
                ) : pointHistory.length === 0 ? (
                    <div className="bg-gray-300 rounded-lg p-8 text-center shadow-md">
                        <p>데이터가 없습니다</p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {pointHistory.map((entry, index) => (
                            <li key={index} className="bg-gray-300 rounded-lg p-4 shadow-md flex justify-between">
                                <div>
                                    <p className="font-bold">{entry.description}</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(entry.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <p className="font-bold text-primary">+{entry.point}P</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
