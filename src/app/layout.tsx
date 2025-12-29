import type { Metadata, Viewport } from 'next';
import './globals.css';
import EmotionRegistry from './EmotionRegistry';
import PWARegister from './PWARegister';

export const metadata: Metadata = {
  title: '간병인보험 손익분기점 계산기',
  description: '간병인보험 손익분기점 계산기',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: '손익분기점',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0c10',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <EmotionRegistry>
          <PWARegister />
          {children}
        </EmotionRegistry>
      </body>
    </html>
  );
}
