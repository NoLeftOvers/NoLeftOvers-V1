'use client';
import { Button } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import { getOcr } from './api/AIResultAPI';
import Cookies from 'js-cookie';

const AiPage = () => {
    const [source, setSource] = useState('');
    const userId = Cookies.get('userId');

    const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const newUrl = URL.createObjectURL(file);
            setSource(newUrl);
            try {
                // 파일을 OCR API로 전송
                const response = await getOcr(file, Number(userId));
                // API 응답을 활용하여 추가 작업 가능
                console.log('OCR Response:', response);
            } catch (error) {
                console.error('OCR 처리 중 오류 발생:', error);
            }
        }
    };
    return (
        <div className="flex w-[100%] justify-center">
            <div className="flex flex-col w-[80%] gap-4 justify-center items-center">
                <div
                    className="min-h-[100px] flex justify-center items-center w-full"
                    style={{
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.03), 0px -4px 4px rgba(0, 0, 0, 0.03)',
                    }}
                >
                    <input
                        accept="image/*"
                        id="icon-button-file"
                        type="file"
                        capture="environment"
                        onChange={(e) => handleCapture(e)}
                    />
                </div>

                <div
                    className="max-h-[300px] overflow-scroll"
                    style={{
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.03), 0px -4px 4px rgba(0, 0, 0, 0.03)',
                    }}
                >
                    {source && <Image src={source} alt={'snap'} width="500" height="500"></Image>}
                </div>

                {source && (
                    <div className="w-full flex flex-col gap-4">
                        <div
                            className="h-full min-h-[100px] overflow-scroll flex justify-center items-center flex-col"
                            style={{
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.03), 0px -4px 4px rgba(0, 0, 0, 0.03)',
                            }}
                        >
                            <p>메세지 내용</p>
                            <p>포인트 점수 : 00점</p>
                        </div>
                        <Button variant="contained" type="submit" sx={{ fontSize: '0.8125rem' }}>
                            홈으로 가기
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiPage;
