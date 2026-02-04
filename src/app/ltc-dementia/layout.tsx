import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '장기요양 치매 보험계산기',
  description: '보험료와 수령액을 기준으로 월 손익분기 기간을 계산합니다.',
  manifest: '/manifest-ltc.webmanifest',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
