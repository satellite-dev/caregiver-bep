'use client';

import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';

type LifelongBasis = 90 | 100;

type FormState = {
  name: string;
  age: string; // 입력 편의상 string
  monthlyPremium: string;
  payCount: string;
  lifelongBasis: LifelongBasis;
  dailyPay: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const DEFAULT_FORM: FormState = {
  name: '',
  age: '',
  monthlyPremium: '',
  payCount: '',
  lifelongBasis: 90,
  dailyPay: '',
};

function onlyDigits(v: string) {
  return v.replace(/[^\d]/g, '');
}

function toKRW(n: number) {
  return `${Math.floor(n).toLocaleString('ko-KR')}원`;
}

function safeInt(v: string) {
  if (!v) return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.floor(n);
}

function calcErrors(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  const age = safeInt(form.age);
  const monthly = safeInt(form.monthlyPremium);
  const count = safeInt(form.payCount);
  const daily = safeInt(form.dailyPay);

  if (form.age && (age === null || age < 0)) errors.age = '현재 나이는 0 이상 정수로 입력해주세요.';
  if (form.monthlyPremium && (monthly === null || monthly < 0))
    errors.monthlyPremium = '월보험료는 0 이상 정수로 입력해주세요.';
  if (form.payCount && (count === null || count < 0)) errors.payCount = '납입 횟수는 0 이상 정수로 입력해주세요.';
  if (form.dailyPay && (daily === null || daily < 1)) errors.dailyPay = '일 지급 금액은 1 이상 정수로 입력해주세요.';

  // 종신 기준은 90/100만 허용
  if (form.lifelongBasis !== 90 && form.lifelongBasis !== 100) {
    errors.lifelongBasis = '종신 기준은 90 또는 100만 선택할 수 있어요.';
  }

  return errors;
}

export default function Page() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const errors = useMemo(() => calcErrors(form), [form]);

  const numbers = useMemo(() => {
    const monthly = safeInt(form.monthlyPremium) ?? 0;
    const count = safeInt(form.payCount) ?? 0;
    const daily = safeInt(form.dailyPay);

    const totalPremium = monthly * count;
    const breakEvenDays = daily && daily > 0 ? Math.floor(totalPremium / daily) : null;
    const breakEvenMonths = breakEvenDays !== null ? Math.floor(breakEvenDays / 30) : null;

    return { monthly, count, daily, totalPremium, breakEvenDays, breakEvenMonths };
  }, [form.monthlyPremium, form.payCount, form.dailyPay]);

  const isCalcReady =
    Object.keys(errors).length === 0 &&
    (safeInt(form.monthlyPremium) ?? 0) >= 0 &&
    (safeInt(form.payCount) ?? 0) >= 0 &&
    (safeInt(form.dailyPay) ?? 0) >= 1;

  const handleChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;

      // 숫자 필드들은 숫자만
      if (key === 'age' || key === 'monthlyPremium' || key === 'payCount' || key === 'dailyPay') {
        setForm((prev) => ({ ...prev, [key]: onlyDigits(value) }));
        return;
      }

      if (key === 'lifelongBasis') {
        const v = Number(value) as LifelongBasis;
        setForm((prev) => ({ ...prev, lifelongBasis: v === 100 ? 100 : 90 }));
        return;
      }

      setForm((prev) => ({ ...prev, [key]: value }));
    };

  const reset = () => setForm(DEFAULT_FORM);

  const copyResult = async () => {
    const namePart = form.name ? `${form.name}님 ` : '';
    const agePart = form.age ? `현재 나이: ${form.age}세\n` : '';
    const total = toKRW(numbers.totalPremium);

    const breakEven =
      numbers.breakEvenDays === null
        ? '계산 불가(일 지급 금액 확인)'
        : `${numbers.breakEvenDays}일(${numbers.breakEvenMonths}달)`;

    const text =
      `${namePart}간병인보험 손익분기점 결과\n` +
      agePart +
      `월보험료: ${toKRW(numbers.monthly)}\n` +
      `납입 횟수: ${numbers.count}회\n` +
      `종신 기준: ${form.lifelongBasis}\n` +
      `일 지급 금액: ${numbers.daily ? toKRW(numbers.daily) : '-'} / 일\n` +
      `총보험료: ${total}\n` +
      `손익분기: ${breakEven}`;

    try {
      await navigator.clipboard.writeText(text);
      alert('결과를 복사했어요.');
    } catch {
      alert('복사에 실패했어요. 브라우저 권한을 확인해주세요.');
    }
  };

  return (
    <Wrap>
      <Header>
        <Title>간병인보험 손익분기점 계산기</Title>
        <Desc>ver.1.0.001</Desc>
      </Header>

      <Grid>
        <Card>
          <CardTitle>입력</CardTitle>

          <Form>
            <Field>
              <Label>이름</Label>
              <Input value={form.name} onChange={handleChange('name')} placeholder="예) 홍길동" />
              <Helper>선택 입력</Helper>
            </Field>

            <Field>
              <Label>현재 나이</Label>
              <Input
                inputMode="numeric"
                value={form.age}
                onChange={handleChange('age')}
                placeholder="예) 45"
              />
              {errors.age ? <Error>{errors.age}</Error> : <Helper>숫자만 입력</Helper>}
            </Field>

            <Field>
              <Label>월보험료</Label>
              <Input
                inputMode="numeric"
                value={form.monthlyPremium}
                onChange={handleChange('monthlyPremium')}
                placeholder="예) 35000"
              />
              {errors.monthlyPremium ? (
                <Error>{errors.monthlyPremium}</Error>
              ) : (
                <Helper>{form.monthlyPremium ? toKRW(Number(form.monthlyPremium)) : '숫자만 입력'}</Helper>
              )}
            </Field>

            <Field>
              <Label>납입 횟수</Label>
              <Input
                inputMode="numeric"
                value={form.payCount}
                onChange={handleChange('payCount')}
                placeholder="예) 240"
              />
              {errors.payCount ? <Error>{errors.payCount}</Error> : <Helper>숫자만 입력</Helper>}
            </Field>

            <Field>
              <Label>종신 기준</Label>
              <Select value={String(form.lifelongBasis)} onChange={handleChange('lifelongBasis')}>
                <option value="90">90</option>
                <option value="100">100</option>
              </Select>
              {errors.lifelongBasis ? <Error>{errors.lifelongBasis}</Error> : <Helper>현재는 90/100 고정</Helper>}
            </Field>

            <Field>
              <Label>일 지급 금액</Label>
              <Input
                inputMode="numeric"
                value={form.dailyPay}
                onChange={handleChange('dailyPay')}
                placeholder="예) 150000"
              />
              {errors.dailyPay ? (
                <Error>{errors.dailyPay}</Error>
              ) : (
                <Helper>{form.dailyPay ? `${toKRW(Number(form.dailyPay))} / 일` : '숫자만 입력'}</Helper>
              )}
            </Field>
          </Form>

          <Actions>
            <Btn type="button" onClick={reset} variant="ghost">
              초기화
            </Btn>
            <Btn type="button" onClick={copyResult} disabled={!isCalcReady}>
              결과 복사
            </Btn>
          </Actions>
        </Card>

        <Card sticky>
          <CardTitle>결과</CardTitle>

          <ResultBox>
            <ResultRow>
              <K>총보험료</K>
              <V>{toKRW(numbers.totalPremium)}</V>
            </ResultRow>

            <Divider />

            <ResultRow>
              <K>손익분기</K>
              <V>
                {numbers.breakEvenDays === null ? (
                  <Muted>일 지급 금액을 1 이상으로 입력해주세요.</Muted>
                ) : (
                  <>
                    {numbers.breakEvenDays}일 <Small>({numbers.breakEvenMonths}달)</Small>
                  </>
                )}
              </V>
            </ResultRow>

            <Note>
              * 손익분기 일수 = ⌊총보험료 ÷ 일 지급 금액⌋, 개월 = ⌊일수 ÷ 30⌋ 기준
            </Note>
          </ResultBox>

          <Summary>
            <SummaryTitle>
              {form.name ? `${form.name}님의 입력 요약` : '입력 요약'}
            </SummaryTitle>
            <SummaryList>
              <li>현재 나이: {form.age ? `${form.age}세` : '-'}</li>
              <li>월보험료: {form.monthlyPremium ? toKRW(Number(form.monthlyPremium)) : '-'}</li>
              <li>납입 횟수: {form.payCount ? `${form.payCount}회` : '-'}</li>
              <li>종신 기준: {form.lifelongBasis}</li>
              <li>일 지급 금액: {form.dailyPay ? `${toKRW(Number(form.dailyPay))} / 일` : '-'}</li>
            </SummaryList>
          </Summary>
        </Card>
      </Grid>
    </Wrap>
  );
}

/* ---------------- styles (Emotion) ---------------- */

const Wrap = styled.div`
  min-height: 100%;
  padding: 24px 16px 48px;
`;

const Header = styled.header`
  max-width: 1100px;
  margin: 0 auto 18px;
`;

const Title = styled.h1`
  margin: 0 0 6px;
  font-size: 22px;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const Desc = styled.p`
  margin: 0;
  opacity: 0.8;
  font-size: 14px;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const Grid = styled.main`
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

const Card = styled.section<{ sticky?: boolean }>`
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

const CardTitle = styled.h2`
  margin: 0 0 12px;
  font-size: 16px;
  opacity: 0.9;
`;

const Form = styled.div`
  display: grid;
  gap: 12px;
`;

const Field = styled.div`
  display: grid;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  opacity: 0.9;
`;

const Input = styled.input`
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

const Select = styled.select`
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

const Helper = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

const Error = styled.div`
  font-size: 12px;
  color: #ff8080;
`;

const Actions = styled.div`
  margin-top: 14px;
  display: flex;
  gap: 10px;
`;

const Btn = styled.button<{ variant?: 'solid' | 'ghost' }>`
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

const ResultBox = styled.div`
  border-radius: 14px;
  padding: 14px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: baseline;
`;

const K = styled.div`
  opacity: 0.8;
  font-size: 13px;
`;

const V = styled.div`
  font-size: 18px;
  font-weight: 700;
  text-align: right;
`;

const Small = styled.span`
  font-size: 13px;
  opacity: 0.85;
  font-weight: 600;
`;

const Divider = styled.div`
  height: 1px;
  margin: 12px 0;
  background: rgba(255, 255, 255, 0.12);
`;

const Note = styled.div`
  margin-top: 10px;
  font-size: 12px;
  opacity: 0.7;
  line-height: 1.4;
`;

const Muted = styled.span`
  font-size: 13px;
  opacity: 0.75;
  font-weight: 600;
`;

const Summary = styled.div`
  margin-top: 14px;
  padding: 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.10);
`;

const SummaryTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 8px;
  opacity: 0.9;
`;

const SummaryList = styled.ul`
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  opacity: 0.85;
  font-size: 13px;
`;
