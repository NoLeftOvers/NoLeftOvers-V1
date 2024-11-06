'use client';
import React, { useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import logoUrl from '@/assets/Logo.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        nickName: '',
        schoolNumber: '',
        password: '',
        confirmPassword: '',
    });

    const [message, setMessage] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'schoolNumber' && !/^[0-9]*$/.test(value)) return;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setMessage('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await fetch(`http://13.209.118.89:8000/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    nickName: formData.nickName,
                    schoolNumber: formData.schoolNumber,
                    password: formData.password,
                }),
            });

            if (response.status === 201) {
                setMessage('회원가입이 성공적으로 완료되었습니다.');
                setRegistrationSuccess(true);
            } else if (response.status === 500) {
                const data = await response.json();
                setMessage(data.message || '서버 오류로 인해 회원가입을 완료할 수 없습니다.');
                setRegistrationSuccess(false);
            } else {
                setMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
                setRegistrationSuccess(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('회원가입 중 오류가 발생했습니다.');
            setRegistrationSuccess(false);
        }
    };

    return (
        <Box className="absolute inset-0 h-full z-10 flex items-center justify-center bg-blue-100">
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    width: '90%',
                    maxWidth: 400,
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
                        id="name"
                        label="이름"
                        variant="outlined"
                        required
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        id="nickName"
                        label="닉네임"
                        variant="outlined"
                        required
                        fullWidth
                        value={formData.nickName}
                        onChange={handleChange}
                    />
                    <TextField
                        id="schoolNumber"
                        label="학번"
                        variant="outlined"
                        required
                        fullWidth
                        value={formData.schoolNumber}
                        onChange={handleChange}
                        inputProps={{ inputMode: 'numeric' }}
                    />
                    <TextField
                        id="password"
                        label="비밀번호(4자리 숫자)"
                        variant="outlined"
                        type="password"
                        required
                        fullWidth
                        value={formData.password}
                        onChange={handleChange}
                        inputProps={{ maxLength: 4 }}
                    />
                    <TextField
                        id="confirmPassword"
                        label="비밀번호 확인"
                        variant="outlined"
                        type="password"
                        required
                        fullWidth
                        value={formData.confirmPassword}
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
                        회원가입
                    </Button>
                    {message && (
                        <Typography variant="body2" color="error" align="center" sx={{ mt: 1 }}>
                            {message}
                        </Typography>
                    )}
                </Box>
                {registrationSuccess && (
                    <Button
                        variant="contained"
                        onClick={() => router.push('/')}
                        sx={{
                            mt: 2,
                            color: 'white',
                            bgcolor: 'primary.main',
                            fontSize: '1rem',
                            '&:hover': { bgcolor: 'primary.dark' },
                        }}
                    >
                        로그인 페이지로 이동
                    </Button>
                )}
            </Paper>
        </Box>
    );
};

export default RegisterPage;
