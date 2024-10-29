'use client';
import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import logoUrl from '@/assets/Logo.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        schoolNumber: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const router = useRouter();

    // 입력 값 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://13.209.118.89:8000/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    schoolNumber: formData.schoolNumber,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.status === 200) {
                setMessage(`로그인 성공! 메인페이지로 이동합니다.`);

                // 로그인 성공 후 토큰과 사용자 ID를 쿠키에 저장
                document.cookie = `token=${data.token}; path=/; max-age=3600; secure; SameSite=Strict`;
                document.cookie = `userId=${data.user.id}; path=/; max-age=3600; secure; SameSite=Strict`;

                // 로그인 성공 후 필요한 페이지로 리다이렉트
                router.push('/mainpage'); // 예를 들어 대시보드 페이지로 이동
            } else {
                setMessage(data.message || '로그인에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('로그인 중 오류가 발생했습니다.');
        }
    };

    return (
        <form
            onSubmit={(e) => handleSubmit(e)}
            className="absolute top-[-5em] left-0 flex justify-center align-middle pl-10 pr-10 gap-10 box-border flex-col right-0 bottom-0 z-20 bg-blue-100"
        >
            <Image src={logoUrl} alt="로고" />
            <TextField
                id="schoolNumber"
                label="학번"
                variant="outlined"
                required
                value={formData.schoolNumber}
                onChange={handleChange}
            />
            <TextField
                id="password"
                label="비밀번호(4자리)"
                variant="outlined"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                inputProps={{ maxLength: 4 }}
            />
            <Button variant="contained" type="submit" sx={{ fontSize: '1rem' }}>
                로그인
            </Button>
            {message && <div className="text-center mt-2">{message}</div>}
        </form>
    );
};

export default LoginPage;
