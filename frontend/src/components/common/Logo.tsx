import React from 'react';
import logoUrl from '@/assets/Logo.png';
import Image from 'next/image';
const Logo = () => {
    return (
        <>
            <Image className="absolute top-0" src={logoUrl} alt="로고" />
        </>
    );
};

export default Logo;
