import React from 'react';
import { Button, TextField } from '@mui/material';
import logoUrl from '@/assets/Logo.png';
import Image from 'next/image';

const page = () => {
    return (
        <form className="absolute top-[-5em] left-0 flex justify-center align-middle pl-10 pr-10 gap-10 box-border flex-col right-0 bottom-0 z-20 bg-blue-100">
            <Image src={logoUrl} alt="로고" />
            <TextField id="schoolNumber" label="학번" variant="outlined" required />
            <TextField id="password" label="비밀번호(4자리)" variant="outlined" type="password" required />
            <Button variant="contained" type="submit" sx={{ fontSize: '1rem' }}>
                로그인
            </Button>
        </form>
    );
};

export default page;