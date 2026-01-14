import Link from 'next/link';
import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: '평화로운 게임마을',
  description: '경쟁을 넘어, 함께의 품격으로. 매너와 존중을 기반으로 한 프라이빗 게임 라운지입니다.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
