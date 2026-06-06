'use client';

import styled from '@emotion/styled';

export const ResultRow = styled.div`
  display: grid;
  gap: 8px;
  padding: 6px 0;
`;

export const K = styled.div`
  color: rgba(255, 255, 255, 0.68);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.35;
`;

export const V = styled.div`
  color: #fff;
  font-size: 26px;
  font-weight: 800;
  line-height: 1.15;
  text-align: left;
  word-break: keep-all;
`;

export const Unit = styled.span`
  margin-left: 4px;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.78;
`;

export const Small = styled.span`
  font-size: 14px;
  opacity: 0.85;
  font-weight: 600;
`;

export const Muted = styled.span`
  font-size: 13px;
  opacity: 0.75;
  font-weight: 600;
`;
