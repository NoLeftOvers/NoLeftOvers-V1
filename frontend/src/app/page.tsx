'use client';
import React, { useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

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
                document.cookie = `token=${data.token}; path=/; max-age=3600; SameSite=Lax`;
                document.cookie = `userId=${data.user.id}; path=/; max-age=3600; SameSite=Lax`;
                router.push('/mainpage');
            } else {
                setMessage(data.message || '로그인에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('로그인 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="absolute inset-0 flex h-full z-10 items-center justify-center bg-blue-100">
            <Paper
                sx={{
                    padding: 4,
                    width: '90%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Image src={logoUrl} alt="로고" width={400} height={100} />
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <TextField
                        id="schoolNumber"
                        label="학번"
                        variant="outlined"
                        required
                        fullWidth
                        value={formData.schoolNumber}
                        onChange={handleChange}
                    />
                    <TextField
                        id="password"
                        label="비밀번호(4자리)"
                        variant="outlined"
                        type="password"
                        required
                        fullWidth
                        value={formData.password}
                        onChange={handleChange}
                        inputProps={{ maxLength: 4 }}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        sx={{
                            mt: 2,
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontSize: '1rem',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            },
                        }}
                    >
                        로그인
                    </Button>
                    {message && (
                        <Typography variant="body2" color="error" align="center" sx={{ mt: 1 }}>
                            {message}
                        </Typography>
                    )}
                </Box>
                <Button
                    onClick={() => router.push('/register')}
                    variant="outlined"
                    fullWidth
                    sx={{
                        mt: 2,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        fontSize: '1rem',
                        '&:hover': {
                            bgcolor: 'primary.light',
                            borderColor: 'primary.dark',
                        },
                    }}
                >
                    회원가입 하러 가기
                </Button>
            </Paper>
        </div>
    );
};

export default LoginPage;
