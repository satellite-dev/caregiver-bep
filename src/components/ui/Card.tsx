'use client';

import styled from '@emotion/styled';

export const Wrap = styled.div`
  min-height: 100%;
  padding: 24px 16px 48px;
`;

export const Header = styled.header`
  max-width: 1100px;
  margin: 0 auto 18px;
`;

export const Title = styled.h1`
  margin: 0 0 6px;
  font-size: 22px;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

export const Desc = styled.p`
  margin: 0;
  opacity: 0.8;
  font-size: 14px;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

export const Grid = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  gap: 14px;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 420px;
    gap: 18px;
    align-items: start;
  }
`;

export const Card = styled.section<{ sticky?: boolean }>`
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);

  ${(p) =>
    p.sticky
      ? `
    @media (min-width: 900px) {
      position: sticky;
      top: 18px;
    }
  `
      : ''}
`;

export const CardTitle = styled.h2`
  margin: 0 0 12px;
  font-size: 16px;
  opacity: 0.9;
`;

export const Divider = styled.div`
  height: 1px;
  margin: 12px 0;
  background: rgba(255, 255, 255, 0.12);
`;

export const ResultBox = styled.div`
  border-radius: 14px;
  padding: 14px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

export const Summary = styled.div`
  margin-top: 14px;
  padding: 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.10);
`;

export const SummaryTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 8px;
  opacity: 0.9;
`;

export const SummaryList = styled.ul`
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  opacity: 0.85;
  font-size: 13px;
`;
