'use client';
import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import logoUrl from '@/assets/Logo.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
    const router = useRouter(); // 페이지 이동을 위한 useRouter hook 사용
    const [formData, setFormData] = useState({
        name: '',
        nickName: '',
        schoolNumber: '',
        password: '',
        confirmPassword: '',
    });

    const [message, setMessage] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false); // 회원가입 성공 여부

    // 입력 값 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        // schoolNumber 필드가 숫자만 입력되도록 제한
        if (id === 'schoolNumber') {
            if (!/^[0-9]*$/.test(value)) {
                return; // 숫자가 아닌 경우 업데이트하지 않음
            }
        }

        setFormData({ ...formData, [id]: value });
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(process.env.SERVER_URL);
        // 비밀번호 확인 로직
        if (formData.password !== formData.confirmPassword) {
            setMessage('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    nickName: formData.nickName,
                    schoolNumber: formData.schoolNumber,
                    password: formData.password,
                }),
            });

            if (response.status === 201) {
                setMessage('회원가입이 성공적으로 완료되었습니다.');
                setRegistrationSuccess(true); // 회원가입 성공 상태 설정
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
        <form
            onSubmit={(e) => handleSubmit(e)}
            className="absolute top-[-5em] left-0 flex justify-center align-middle pl-10 pr-10 gap-10 box-border flex-col right-0 bottom-0 z-20 bg-blue-100"
        >
            <Image src={logoUrl} alt="로고" />
            <TextField
                id="name"
                label="이름"
                variant="outlined"
                required
                value={formData.name}
                onChange={handleChange}
            />
            <TextField
                id="nickName"
                label="닉네임"
                variant="outlined"
                required
                value={formData.nickName}
                onChange={handleChange}
            />
            <TextField
                id="schoolNumber"
                label="학번"
                variant="outlined"
                required
                value={formData.schoolNumber}
                onChange={handleChange}
                inputProps={{ inputMode: 'numeric' }} // 숫자만 입력 가능하도록 설정
            />
            <TextField
                id="password"
                label="비밀번호(4자리숫자)"
                variant="outlined"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                inputProps={{ maxLength: 4 }} // 4자리로 제한
            />
            <TextField
                id="confirmPassword"
                label="비밀번호 확인"
                variant="outlined"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                inputProps={{ maxLength: 4 }} // 4자리로 제한
            />
            <Button variant="contained" type="submit" sx={{ fontSize: '1rem' }}>
                회원가입
            </Button>
            {message && (
                <div className="text-center mt-2">
                    <p>{message}</p>
                    {registrationSuccess && (
                        <Button
                            variant="contained"
                            onClick={() => router.push('/login')}
                            sx={{
                                fontSize: '1rem',
                                marginTop: '0.5rem',
                                padding: '0.4rem 1.5rem',
                                color: 'white',
                                backgroundColor: '#1976d2',
                                '&:hover': { backgroundColor: '#1565c0' },
                            }}
                        >
                            로그인 페이지로 이동
                        </Button>
                    )}
                </div>
            )}
        </form>
    );
};

export default RegisterPage;
