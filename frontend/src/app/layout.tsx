import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

import '../style/globals.css';
import Logo from '@/components/common/Logo';
import BottomNavigationBar from '@/components/common/BottomNavigationBar';

const pretendard = localFont({
    src: '../style/fonts/PretendardVariable.woff2',
    variable: '--font-pretendard',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'NoLeftOvers-V1',
    description: 'for ESG Campaign',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${pretendard.variable}  antialiased`}>
                <AppRouterCacheProvider>
                    {/* 이후 로그인 시에만 아래의 네비게이션 바가 생기도록 , 방식은 다양*/}
                    <Logo />
                    {children}
                    <BottomNavigationBar />
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
