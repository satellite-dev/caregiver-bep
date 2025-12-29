import type { Metadata } from 'next';
import './globals.css';
import EmotionRegistry from './EmotionRegistry';

export const metadata: Metadata = {
  title: '간병인보험 손익분기점 계산기',
  description: '클라이언트에서만 계산하는 손익분기점 계산기',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <EmotionRegistry>{children}</EmotionRegistry>
      </body>
    </html>
  );
}
