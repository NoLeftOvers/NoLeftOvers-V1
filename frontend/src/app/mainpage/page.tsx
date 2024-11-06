'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface MenuItem {
    meal_time: string;
    dishes: string[];
}

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

    const fetchAllMenuData = async () => {
        try {
            const responses = await Promise.all([
                axios.get(`http://13.209.118.89:8000/api/menu`, { params: { restaurantType: 'gyo' } }),
                axios.get(`http://13.209.118.89:8000/api/menu`, { params: { restaurantType: 'bi' } }),
                axios.get(`http://13.209.118.89:8000/api/menu`, { params: { restaurantType: 'gick' } }),
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

    useEffect(() => {
        fetchAllMenuData();
    }, []);

    const renderMenuByTime = (menuList: MenuItem[]) => {
        if (!menuList || menuList.length === 0) {
            return <p className="text-gray-500 italic">데이터가 없습니다</p>;
        }

        const times = ['아침', '점심', '저녁'];

        return (
            <div className="flex flex-col items-start gap-4">
                {times.map((time) => {
                    const menuForTime = menuList.find((menu) => menu.meal_time === time);
                    return (
                        <div key={time} className="flex items-center gap-4">
                            <h3 className="text-base font-semibold text-blue-600 w-20">{time}</h3>
                            {menuForTime ? (
                                <p className="text-gray-800 w-full">{menuForTime.dishes.join(', ')}</p>
                            ) : (
                                <p className="text-gray-400 w-full pl-1"> 아직 올라오지 않았어요</p>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 p-6 h-[90%]  overflow-auto">
            {['교대', '비타', '3생활관'].map((restaurant, index) => (
                <div
                    key={restaurant}
                    className="bg-white rounded-lg p-8 shadow-md flex flex-col items-center gap-6"
                    style={{
                        boxShadow:
                            '0 4px 8px rgba(0, 0, 0, 0.01), 0 -4px 8px rgba(0, 0, 0, 0.01), 4px 0 8px rgba(0, 0, 0, 0.01), -4px 0 8px rgba(0, 0, 0, 0.01)',
                    }}
                >
                    <h2 className="text-xl font-semibold text-center text-blue-500">{restaurant} 식단표</h2>
                    <div className="w-full text-start">
                        {renderMenuByTime(menuData[index === 0 ? 'gyo' : index === 1 ? 'bi' : 'gick'])}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MainPage;
