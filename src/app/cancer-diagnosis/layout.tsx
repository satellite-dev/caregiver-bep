import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '3대 질병 진단비 계산기',
  description: '암, 뇌혈관질환, 허혈성 심장질환 권장 진단비를 계산합니다.',
  manifest: '/manifest-cancer.webmanifest',
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
