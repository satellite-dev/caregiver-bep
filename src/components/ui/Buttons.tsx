'use client';

import styled from '@emotion/styled';

export const Actions = styled.div`
  margin-top: 14px;
  display: flex;
  gap: 10px;
`;

export const Btn = styled.button<{ variant?: 'solid' | 'ghost' }>`
  flex: 1;
  border-radius: 12px;
  padding: 12px 12px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.14);

  ${(p) =>
    p.variant === 'ghost'
      ? `
    background: transparent;
    color: rgba(255,255,255,0.9);
  `
      : `
    background: rgba(255,255,255,0.18);
    color: #fff;
  `}

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
