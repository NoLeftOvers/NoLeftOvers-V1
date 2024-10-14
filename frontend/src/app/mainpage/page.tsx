"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MenuPage = () => {
    const [menuData, setMenuData] = useState({
        gyo: null,
        bi: null,
        gick: null,
    });
    const [loading, setLoading] = useState(true);

    // 3개의 API 데이터를 불러오는 함수
    const fetchAllMenuData = async () => {
        try {
            const responses = await Promise.all([
                axios.get('http://localhost:8000/menu', { params: { restaurantType: 'gyo' } }),
                axios.get('http://localhost:8000/menu', { params: { restaurantType: 'bi' } }),
                axios.get('http://localhost:8000/menu', { params: { restaurantType: 'gick' } }),
            ]);

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

    if (loading) {
        return <div>로딩 중...</div>; // 데이터가 로딩 중일 때 표시
    }

    return (
                <div className="flex flex-col gap-6 p-4">

                    {/* 교대 식단표 */}
                    <div className="bg-gray-300 rounded-lg p-16 shadow-md h-50 flex flex-col justify-center items-center">
                        <h2 className="text-center text-xl font-bold">교대 식단표</h2>
                        {menuData.gyo ? (
                            <div className="text-center">
                                <p>날짜: {menuData.gyo.date}</p>
                                <p>요일: {menuData.gyo.day_of_week}</p>
                                <p>식사 시간: {menuData.gyo.meal_time}</p>
                                <p>메뉴: {menuData.gyo.dishes}</p>
                            </div>
                        ) : (
                            <p>데이터가 없습니다</p>
                        )}
                    </div>

                    {/* 비타 식단표 */}
                    <div className="bg-gray-300 rounded-lg p-16 shadow-md h-50 flex flex-col justify-center items-center">
                        <h2 className="text-center text-xl font-bold">비타 식단표</h2>
                        {menuData.bi ? (
                            <div className="text-center">
                                <p>날짜: {menuData.bi.date}</p>
                                <p>요일: {menuData.bi.day_of_week}</p>
                                <p>식사 시간: {menuData.bi.meal_time}</p>
                                <p>메뉴: {menuData.bi.dishes}</p>
                            </div>
                        ) : (
                            <p>데이터가 없습니다</p>
                        )}
                    </div>

                    {/* 3식 식단표 */}
                    <div className="bg-gray-300 rounded-lg p-16 shadow-md h-50 flex flex-col justify-center items-center">
                        <h2 className="text-center text-xl font-bold">3식 식단표</h2>
                        {menuData.gick ? (
                            <div className="text-center">
                                <p>날짜: {menuData.gick.date}</p>
                                <p>요일: {menuData.gick.day_of_week}</p>
                                <p>식사 시간: {menuData.gick.meal_time}</p>
                                <p>메뉴: {menuData.gick.dishes}</p>
                            </div>
                        ) : (
                            <p>데이터가 없습니다</p>
                        )}
                    </div>

                </div>
    );
};

export default MenuPage;
