'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 메뉴 아이템의 타입 정의
interface MenuItem {
    meal_time: string; // "아침", "점심", "저녁" 중 하나
    dishes: string[]; // 각 식사 시간에 해당하는 음식 이름 배열
}

// MenuData의 타입 정의
interface MenuData {
    gyo: MenuItem[];
    bi: MenuItem[];
    gick: MenuItem[];
}

const MainPage = () => {
    const [menuData, setMenuData] = useState<MenuData>({
        gyo: [],
        bi: [],
        gick: [],
    });
    const [loading, setLoading] = useState(true);

    // 3개의 API 데이터를 불러오는 함수
    const fetchAllMenuData = async () => {
        try {
            const responses = await Promise.all([
                axios.get(`http://13.209.118.89:8000/api/menu`, { params: { restaurantType: 'gyo' } }),
                axios.get(`http://13.209.118.89:8000/api/menu`, { params: { restaurantType: 'bi' } }),
                axios.get(`http://13.209.118.89:8000/api/menu`, { params: { restaurantType: 'gick' } }),
            ]);
            console.log(responses);
            setMenuData({
                gyo: responses[0].data,
                bi: responses[1].data,
                gick: responses[2].data,
            });
        } catch (error) {
            console.error('Error fetching menu data:', error);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트가 처음 렌더링될 때 API 호출
    useEffect(() => {
        fetchAllMenuData();
    }, []);

    // 특정 식당의 메뉴 데이터를 시간대별로 간단히 렌더링하는 함수
    const renderMenuByTime = (menuList: MenuItem[]) => {
        if (!menuList || menuList.length === 0) {
            return <p>데이터가 없습니다</p>;
        }

        const times = ['아침', '점심', '저녁'];

        return (
            <div className="flex flex-col items-start gap-2">
                {times.map((time) => {
                    const menuForTime = menuList.find((menu) => menu.meal_time === time);
                    return (
                        <div key={time} className="flex">
                            <h3 className="text-base font-bold mr-4 w-16">{time}</h3>
                            {menuForTime ? (
                                <p className="text-gray-700 flex-1">{menuForTime.dishes.join(', ')}</p>
                            ) : (
                                <p className="text-gray-700 flex-1">데이터가 없습니다</p>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) {
        return <div>로딩 중...</div>; // 데이터가 로딩 중일 때 표시
    }

    return (
        <div className="flex flex-col gap-6 p-4 overflow-scroll h-[90%]">
            {/* 교대 식단표 */}
            <div
                className="bg-white rounded-lg p-6  flex flex-col items-center gap-4"
                style={{
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.03), 0px -4px 4px rgba(0, 0, 0, 0.03)',
                }}
            >
                <h2 className="text-lg font-bold mb-2 text-center">교대 식단표</h2>
                <div className="w-full flex flex-col items-start">{renderMenuByTime(menuData.gyo)}</div>
            </div>

            {/* 비타 식단표 */}
            <div
                className="bg-white rounded-lg p-6  flex flex-col items-center gap-4"
                style={{
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.03), 0px -4px 4px rgba(0, 0, 0, 0.03)',
                }}
            >
                <h2 className="text-lg font-bold mb-2 text-center">비타 식단표</h2>
                <div className="w-full flex flex-col items-start">{renderMenuByTime(menuData.bi)}</div>
            </div>

            {/* 3식 식단표 */}
            <div
                className="bg-white rounded-lg p-6  flex flex-col items-center gap-4"
                style={{
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.03), 0px -4px 4px rgba(0, 0, 0, 0.03)',
                }}
            >
                <h2 className="text-lg font-bold mb-2 text-center">3식 식단표</h2>
                <div className="w-full flex flex-col items-start">{renderMenuByTime(menuData.gick)}</div>
            </div>
        </div>
    );
};

export default MainPage;
