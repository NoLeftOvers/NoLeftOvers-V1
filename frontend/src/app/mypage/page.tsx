'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface PointHistoryEntry {
    description: string;
    created_at: string;
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

    const userId = Cookies.get('userId');

    useEffect(() => {
        const fetchUserData = async () => {
            const token = Cookies.get('token');
            if (!userId) {
                console.error('User ID not found in cookies');
                return;
            }

            try {
                const response = await axios.get<UserData>(
                    `http://13.209.118.89:8000/api/user/point?userId=${userId}`,
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
        <div className="w-full p-4 overflow-y-scroll pb-16 h-[90%] ">
            <div className="mb-6 p-6 text-center bg-blue-50 rounded-lg shadow-lg">
                <h2 className="font-bold text-2xl text-blue-800 mb-4">{nickName}님</h2>
                <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-5 mt-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-200 rounded-full flex justify-center items-center">
                            <span className="text-blue-800 font-bold">★</span>
                        </div>
                        <span className="font-bold text-blue-700 text-lg">총 포인트</span>
                    </div>
                    <span className="text-blue-600 font-extrabold text-2xl">{totalPoints}P</span>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-lg text-blue-800 text-center mb-3">포인트 내역</h3>

                {loading ? (
                    <p className="text-center text-blue-600">로딩 중...</p>
                ) : pointHistory.length === 0 ? (
                    <div className="bg-blue-50 rounded-lg p-8 text-center shadow-md text-blue-700">
                        <p>데이터가 없습니다</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {pointHistory.map((entry, index) => (
                            <li
                                key={index}
                                className="bg-white rounded-lg p-5 shadow-md flex justify-between items-center border-l-4 border-blue-300"
                            >
                                <div>
                                    <p className="font-semibold text-gray-800">{entry.description}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(entry.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <p className="font-bold text-green-600 text-lg">+{entry.point}P</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
