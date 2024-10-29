'use client';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import React, { useState } from 'react';
import userIconUrl from '@/assets/userIcon.svg';
import rankIconUrl from '@/assets/rankIcon.svg';
import cameraIconUrl from '@/assets/cameraIcon.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const BottomNavigationBar = () => {
    const router = useRouter();
    const [value, setValue] = useState();

    const handleNavigation = (path: string) => {
        router.push(path); // 지정된 경로로 이동
    };

    return (
        <BottomNavigation
            sx={{ backgroundColor: '#CBE8F9' }}
            className="absolute bottom-0 w-full"
            showLabels
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
        >
            <BottomNavigationAction
                label="랭킹"
                icon={<Image src={rankIconUrl} alt="랭킹" />}
                onClick={() => handleNavigation('/rank')} // /rank 경로로 이동
            />
            <BottomNavigationAction
                label="잔반 검사 받기"
                onClick={() => handleNavigation('/ai')} // /ai 경로로 이동
                icon={<Image src={cameraIconUrl} alt="카메라" />}
            />
            <BottomNavigationAction
                label="마이페이지"
                icon={<Image src={userIconUrl} alt="마이페이지" />}
                onClick={() => handleNavigation('/mypage')} // /mypage 경로로 이동
            />
        </BottomNavigation>
    );
};

export default BottomNavigationBar;
