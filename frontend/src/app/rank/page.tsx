'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface RankData {
    nickName: string;
    points: number;
}

const UserRank = () => {
    const [rankData, setRankData] = useState<RankData[]>([]);

    useEffect(() => {
        const fetchRankData = async () => {
            try {
                const response = await axios.get(`http://13.209.118.89:8000/api/user/rank`, {
                    headers: {
                        Accept: 'application/json',
                    },
                });
                setRankData(response.data);
            } catch (error) {
                console.error('Error fetching user rank:', error);
            }
        };

        fetchRankData();
    }, []);

    return (
        <div className="flex flex-col gap-6 p-4 overflow-y-scroll h-[90%] ">
            <h2 className="text-center text-2xl font-bold text-blue-700 mb-6">유저 포인트 랭킹</h2>

            {/* 상위 3위 표시 */}
            <div className="flex justify-center gap-6 items-end">
                {/* 2위 */}
                <div className="relative bg-blue-100 rounded-xl p-6 shadow-lg h-28 w-36 flex flex-col justify-center items-center">
                    <span className="absolute top-4 left-1/2 transform -translate-x-1/2 text-lg font-bold text-blue-600">
                        &nbsp;2위🥈
                    </span>
                    {rankData[1] ? (
                        <>
                            <p className="mt-6 text-sm font-semibold text-gray-800">{rankData[1].nickName}</p>
                            <p className="text-base font-bold text-blue-600">{rankData[1].points}점</p>
                        </>
                    ) : (
                        <p className="mt-6 text-sm font-bold text-gray-500">데이터가 없습니다</p>
                    )}
                </div>

                {/* 1위 */}
                <div className="relative bg-yellow-200 rounded-xl p-8 shadow-lg h-36 w-48 flex flex-col justify-center items-center">
                    <span className="absolute top-6 left-1/2 transform -translate-x-1/2 text-lg font-bold text-yellow-800">
                        &nbsp;1위🏅
                    </span>
                    {rankData[0] ? (
                        <>
                            <p className="mt-6 text-lg font-extrabold text-gray-900">{rankData[0].nickName}</p>
                            <p className="text-xl font-bold text-yellow-800">{rankData[0].points}점</p>
                        </>
                    ) : (
                        <p className="mt-6 text-sm font-bold text-gray-500">데이터가 없습니다</p>
                    )}
                </div>

                {/* 3위 */}
                <div className="relative bg-blue-100 rounded-xl p-6 shadow-lg h-28 w-36 flex flex-col justify-center items-center">
                    <span className="absolute top-4 left-1/2 transform -translate-x-1/2 text-lg font-bold text-blue-600">
                        &nbsp; 3위🥉
                    </span>
                    {rankData[2] ? (
                        <>
                            <p className="mt-6 text-sm font-semibold text-gray-800">{rankData[2].nickName}</p>
                            <p className="text-base font-bold text-blue-600">{rankData[2].points}점</p>
                        </>
                    ) : (
                        <p className="mt-6 text-sm font-bold text-gray-500">데이터가 없습니다</p>
                    )}
                </div>
            </div>

            {/* 나머지 랭킹 */}
            <div className="flex flex-col gap-3 mt-6">
                {rankData.slice(3, 10).map((entry, index) => (
                    <div
                        key={index + 3}
                        className="bg-white rounded-lg h-14 p-4 shadow-md flex justify-between items-center border-l-4 border-blue-300"
                    >
                        <span className="text-gray-600 font-bold">{index + 4}위</span>
                        <p className="text-sm font-semibold text-gray-800">{entry.nickName}</p>
                        <p className="text-sm font-bold text-blue-700">{entry.points}점</p>
                    </div>
                ))}

                {/* 데이터가 없을 경우 */}
                {rankData.length <= 3 &&
                    Array(7)
                        .fill(null)
                        .map((_, index) => (
                            <div
                                key={index + 3}
                                className="bg-gray-200 rounded-lg h-14 p-4 shadow-md flex justify-center items-center"
                            >
                                <p className="text-sm font-semibold text-gray-500">데이터가 없습니다</p>
                            </div>
                        ))}
            </div>
        </div>
    );
};

export default UserRank;
