import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

import '../style/globals.css';
import Logo from '@/components/common/Logo';
import BottomNavigationBar from '@/components/common/BottomNavigationBar';
import BackNavigation from '@/components/common/BackButton';

export const viewport: Viewport = {
    themeColor: 'black',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
};

const pretendard = localFont({
    src: '../style/fonts/PretendardVariable.woff2',
    variable: '--font-pretendard',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'NoLeftOvers-V1',
    description: 'for ESG Campaign',
    manifest: '/manifest.json',
    icons: {
        icon: '/test_icon.png',
        shortcut: '/test_icon.png',
        apple: '/test_icon.png',
        other: {
            rel: 'apple-touch-icon-precomposed',
            url: '/test_icon.png',
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${pretendard.variable} pt-32  antialiased relative overflow-hidden`}>
                <AppRouterCacheProvider>
                    <BackNavigation />
                    {/* 이후 로그인 시에만 아래의 네비게이션 바가 생기도록 , 방식은 다양*/}
                    <Logo />
                    {children}
                    <BottomNavigationBar />
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
