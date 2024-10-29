'use client';
import { Button, CircularProgress } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import { getOcr } from './api/AIResultAPI';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AiPage = () => {
    const [source, setSource] = useState('');
    const [result, setResult] = useState(false);
    const [ocrData, setOcrData] = useState({ description: '', point: 0 });
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const userId = Cookies.get('userId');
    const router = useRouter();

    const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const newUrl = URL.createObjectURL(file);
            setSource(newUrl);
            setLoading(true); // 로딩 시작
            try {
                const response = await getOcr(file, Number(userId)); // OCR 응답을 받아옵니다.
                setOcrData({ description: response.description, point: response.point }); // OCR 데이터 상태에 저장
                setResult(true);
            } catch (error) {
                console.error('OCR 처리 중 오류 발생:', error);
            } finally {
                setLoading(false); // 로딩 종료
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

                {loading ? ( // 로딩 중일 때 표시
                    <div className="flex justify-center items-center">
                        <CircularProgress />
                    </div>
                ) : (
                    result && (
                        <div className="w-full flex flex-col gap-4 ">
                            <div
                                className="h-full min-h-[100px] flex justify-center items-center flex-col"
                                style={{
                                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.03), 0px -4px 4px rgba(0, 0, 0, 0.03)',
                                }}
                            >
                                <p>{ocrData.description}</p>
                                <p>포인트 점수 : {ocrData.point}점</p>
                            </div>
                            <Button
                                onClick={() => router.push('/mainpage')}
                                variant="contained"
                                type="submit"
                                sx={{ fontSize: '0.8125rem' }}
                            >
                                홈으로 가기
                            </Button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default AiPage;
