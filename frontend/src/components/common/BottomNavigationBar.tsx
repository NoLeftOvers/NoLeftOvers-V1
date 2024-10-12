'use client';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import React, { useState } from 'react';
import userIconUrl from '@/assets/userIcon.svg';
import rankIconUrl from '@/assets/rankIcon.svg';
import cameraIconUrl from '@/assets/cameraIcon.svg';
import Image from 'next/image';

const BottomNavigationBar = () => {
    const [value, setValue] = useState();
    return (
        <BottomNavigation
            sx={{ backgroundColor: '#CBE8F9' }}
            className="absolute bottom-0 w-[100%]"
            showLabels
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
        >
            <BottomNavigationAction label="랭킹" icon={<Image src={rankIconUrl} alt="랭킹" />} />
            <BottomNavigationAction className="bottom-[1em]" icon={<Image src={cameraIconUrl} alt="카메라" />} />
            <BottomNavigationAction label="마이페이지" icon={<Image src={userIconUrl} alt="마이페이지" />} />
        </BottomNavigation>
    );
};

export default BottomNavigationBar;
