'use client';

import styled from '@emotion/styled';

export const Form = styled.div`
  display: grid;
  gap: 12px;
`;

export const Field = styled.div`
  display: grid;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 13px;
  opacity: 0.9;
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.22);
  color: #fff;
  border-radius: 12px;
  padding: 12px 12px;
  font-size: 15px;
  outline: none;

  &:focus {
    border-color: rgba(255, 255, 255, 0.35);
  }
`;

export const Select = styled.select`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.22);
  color: #fff;
  border-radius: 12px;
  padding: 12px 12px;
  font-size: 15px;
  outline: none;

  &:focus {
    border-color: rgba(255, 255, 255, 0.35);
  }
`;

export const ReadonlyBox = styled.div`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(0, 0, 0, 0.12);
  color: rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  padding: 12px 12px;
  font-size: 15px;
`;

export const Helper = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

export const Error = styled.div`
  font-size: 12px;
  color: #ff8080;
`;

export const TwoCol = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
`;

export const ThreeRow = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 14px;
  }
`;

export const Section = styled.div`
  display: grid;
  gap: 10px;
  padding-top: 6px;
`;

export const SectionTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  opacity: 0.85;
`;
