'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';

// 메뉴 아이템의 타입 정의
interface RankData {
    nickName: string;
    points: number;
}

const UserRank = () => {
    const [rankData, setRankData] = useState<RankData[]>([]);

    useEffect(() => {
        // 컴포넌트가 마운트될 때 데이터를 가져옴
        const fetchRankData = async () => {
            try {
                const response = await axios.get(`http://13.209.118.89:8000/api/user/rank`, {
                    headers: {
                        Accept: 'application/json',
                    },
                });
                setRankData(response.data); // 리스트 데이터 설정
            } catch (error) {
                console.error('Error fetching user rank:', error);
            }
        };

        fetchRankData();
    }, []);

    return (
        <div className="flex flex-col gap-6 p-4 overflow-y-scroll h-[90%]">
            <h2 className="text-center text-xl font-bold">유저 포인트 랭킹</h2>

            {/* 상위 3위 표시 */}
            <div className="flex justify-center gap-4 items-end">
                {/* 2위 */}
                <div className="relative bg-gray-300 rounded-lg p-8 shadow-md h-24 w-40 flex flex-col justify-center items-center">
                    {rankData[1] ? (
                        <>
                            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-lg font-bold">
                                2위
                            </span>
                            <p className="mt-4 text-sm font-semibold">{rankData[1].nickName}</p>
                            <p className="text-base">{rankData[1].points}점</p>
                        </>
                    ) : (
                        <>
                            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-lg font-bold">
                                2위
                            </span>
                            <p className="mt-4 text-sm font-bold">데이터가 없습니다</p>
                        </>
                    )}
                </div>

                {/* 1위 */}
                <div className="relative bg-gray-300 rounded-lg p-8 shadow-md h-32 w-48 flex flex-col justify-center items-center">
                    {rankData[0] ? (
                        <>
                            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-lg font-bold">
                                1위🏅
                            </span>
                            <p className="mt-4 text-lg font-extrabold">{rankData[0].nickName}</p>{' '}
                            {/* 1위 닉네임 크기 키움 */}
                            <p className="text-lg">{rankData[0].points}점</p>
                        </>
                    ) : (
                        <>
                            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-lg font-bold">
                                1위🏅
                            </span>
                            <p className="mt-4 text-sm font-bold">데이터가 없습니다</p>
                        </>
                    )}
                </div>

                {/* 3위 */}
                <div className="relative bg-gray-300 rounded-lg p-8 shadow-md h-24 w-40 flex flex-col justify-center items-center">
                    {rankData[2] ? (
                        <>
                            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-lg font-bold">
                                3위
                            </span>
                            <p className="mt-4 text-sm font-semibold">{rankData[2].nickName}</p>
                            <p className="text-base">{rankData[2].points}점</p>
                        </>
                    ) : (
                        <>
                            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-lg font-bold">
                                3위
                            </span>
                            <p className="mt-4 text-sm font-bold">데이터가 없습니다</p>
                        </>
                    )}
                </div>
            </div>

            {/* 나머지 랭킹 */}
            <div className="flex flex-col gap-2">
                {Array(7)
                    .fill(null)
                    .map((_, index) => (
                        <div
                            key={index + 3}
                            className="bg-gray-300 rounded-lg h-12 p-2 shadow-md flex justify-between items-center"
                        >
                            {rankData[index + 3] ? (
                                <>
                                    <p className="text-sm font-semibold ml-24">{rankData[index + 3].nickName}</p>
                                    <p className="text-sm font-semibold mr-24">{rankData[index + 3].points}점</p>
                                </>
                            ) : (
                                <p className="text-sm font-semibold text-center w-full">데이터가 없습니다</p>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default UserRank;
