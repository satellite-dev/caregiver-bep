import type { Metadata, Viewport } from 'next';
import './globals.css';
import EmotionRegistry from './EmotionRegistry';
import PWARegister from './PWARegister';

export const metadata: Metadata = {
  title: {
    default: '보험 계산기',
    template: '%s | 보험 계산기',
  },
  description: '보험 관련 계산을 간편하게 제공하는 웹 계산기',
  manifest: '/manifest-caregiver.webmanifest',
  appleWebApp: {
    capable: true,
    title: '보험 계산기',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0c10',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
