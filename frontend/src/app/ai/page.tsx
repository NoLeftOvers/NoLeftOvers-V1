'use client';
import { Button, CircularProgress, Typography, Box } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import { getOcr } from './api/AIResultAPI';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AiPage = () => {
    const [source, setSource] = useState('');
    const [result, setResult] = useState(false);
    const [ocrData, setOcrData] = useState({ description: '', point: 0 });
    const [loading, setLoading] = useState(false);
    const userId = Cookies.get('userId');
    const router = useRouter();

    const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const newUrl = URL.createObjectURL(file);
            setSource(newUrl);
            setLoading(true);
            try {
                const response = await getOcr(file, Number(userId));
                setOcrData({ description: response.description, point: response.point });
                setResult(true);
            } catch (error) {
                console.error('OCR 처리 중 오류 발생:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="w-full p-4  overflow-y-scroll pb-16 h-[90%]">
            <Box display="flex" justifyContent="center" width="100%">
                <Box display="flex" flexDirection="column" alignItems="center" gap={4} width="80%">
                    <Box
                        sx={{
                            width: '100%',
                            minHeight: 100,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                            borderRadius: 2,
                            backgroundColor: '#f7f7f7',
                        }}
                    >
                        <input
                            accept="image/*"
                            id="icon-button-file"
                            type="file"
                            capture="environment"
                            onChange={handleCapture}
                            style={{ padding: '10px' }}
                        />
                    </Box>

                    <Box
                        sx={{
                            maxHeight: 300,
                            overflow: 'auto',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                            borderRadius: 2,
                        }}
                    >
                        {source && (
                            <Image src={source} alt={'snap'} width={500} height={500} style={{ borderRadius: 8 }} />
                        )}
                    </Box>

                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                            <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                        </Box>
                    ) : (
                        result && (
                            <Box
                                display="flex"
                                flexDirection="column"
                                gap={2}
                                alignItems="center"
                                width="100%"
                                p={2}
                                sx={{
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                    borderRadius: 2,
                                    backgroundColor: '#fafafa',
                                }}
                            >
                                <Typography variant="body1" color="textSecondary">
                                    {ocrData.description}
                                </Typography>
                                <Typography variant="h6" color="textPrimary">
                                    포인트 점수: {ocrData.point}점
                                </Typography>
                                <Button
                                    onClick={() => router.push('/mainpage')}
                                    variant="contained"
                                    sx={{ backgroundColor: '#74C6F5', fontSize: '0.8125rem', mt: 2 }}
                                >
                                    홈으로 가기
                                </Button>
                            </Box>
                        )
                    )}
                </Box>
            </Box>
        </div>
    );
};

export default AiPage;
