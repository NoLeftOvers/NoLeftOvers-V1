import React from 'react';
import logoUrl from '@/assets/Logo2.png';
import Image from 'next/image';

const Logo = () => {
    return (
        <Image
            className="absolute top-0"
            src={logoUrl}
            alt="로고"
            style={{
                boxShadow: '0px 3px 0px #74C6F5',
                borderRadius: '8px',
            }}
        />
    );
};

export default Logo;
