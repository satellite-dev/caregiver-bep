'use client';

import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';

type LifelongBasis = 90 | 100;

type FormState = {
  name: string;
  age: string; // string 입력
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

function safeInt(v: string) {
  if (!v) return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.floor(n);
}

function toKRW(n: number) {
  return `${Math.floor(n).toLocaleString('ko-KR')}원`;
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function diffDays(a: Date, b: Date) {
  // b - a (일 단위)
  const ms = startOfDay(b).getTime() - startOfDay(a).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

/**
 * 현재 나이만 있는 상황에서 "남은 일수"를 추정:
 * - 오늘을 기준으로 'age'를 만족하는 생일을 가정(=오늘 - age년)
 * - 그 생년을 기반으로, (생년 + 종신나이) 해의 12/31까지 남은 일수
 */
function calcRemainingDaysToDec31OfLifelongAge(age: number, lifelongBasis: LifelongBasis) {
  const today = new Date();

  // 오늘 기준 정확히 age가 되도록 생일을 가정
  const assumedBirth = new Date(today);
  assumedBirth.setFullYear(today.getFullYear() - age);

  const targetYear = assumedBirth.getFullYear() + lifelongBasis;
  const target = new Date(targetYear, 11, 31); // Dec 31

  const remaining = diffDays(today, target);
  return {
    remainingDays: Math.max(0, remaining),
    targetYear,
    targetDateText: `${targetYear}.12.31`,
  };
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

    const age = safeInt(form.age);

    const remaining =
      age !== null ? calcRemainingDaysToDec31OfLifelongAge(age, form.lifelongBasis) : null;

    return {
      monthly,
      count,
      daily,
      totalPremium,
      breakEvenDays,
      breakEvenMonths,
      age,
      remaining,
    };
  }, [form.monthlyPremium, form.payCount, form.dailyPay, form.age, form.lifelongBasis]);

  const isCalcReady =
    Object.keys(errors).length === 0 &&
    (safeInt(form.monthlyPremium) ?? 0) >= 0 &&
    (safeInt(form.payCount) ?? 0) >= 0 &&
    (safeInt(form.dailyPay) ?? 0) >= 1;

  const handleChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;

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
    const namePart = form.name ? `${form.name}님\n` : '';
    const agePart = numbers.age !== null ? `현재 나이: ${numbers.age}세\n` : '';

    const total = toKRW(numbers.totalPremium);
    const breakEven =
      numbers.breakEvenDays === null ? '계산 불가(일 지급 금액 확인)' : `${numbers.breakEvenDays}일(${numbers.breakEvenMonths}달)`;

    const remainingText =
      numbers.remaining && numbers.age !== null
        ? `앞으로 남은 날(추정): 종신 ${form.lifelongBasis}세 기준 ${numbers.remaining.targetDateText}까지 ${numbers.remaining.remainingDays}일\n`
        : '';

    const text =
      `${namePart}간병인보험 손익분기점 계산 결과\n` +
      agePart +
      `월보험료: ${toKRW(numbers.monthly)}\n` +
      `납입 횟수: ${numbers.count}회\n` +
      `종신 기준: ${form.lifelongBasis}\n` +
      `일 지급 금액: ${numbers.daily ? `${toKRW(numbers.daily)} / 일` : '-'}\n` +
      `총보험료: ${total}\n` +
      `손익분기: ${breakEven}\n` +
      remainingText;

    try {
      await navigator.clipboard.writeText(text);
      alert('결과를 복사했어요.');
    } catch {
      alert('복사에 실패했어요. 브라우저 권한을 확인해주세요.');
    }
  };

  const breakEvenSentence = useMemo(() => {
    if (numbers.breakEvenDays === null) return null;

    // “앞으로 살아갈 날” 계산이 가능한 경우
    if (numbers.remaining) {
      return `앞으로 남은 날 대비, ${numbers.breakEvenDays.toLocaleString('ko-KR')}일만 입원하면 손익분기점에 도달해요.`;
    }

    // 나이를 안 넣었을 때도 문구는 보여주되, 남은 날 대비 표현은 제외
    return `${numbers.breakEvenDays.toLocaleString('ko-KR')}일만 입원하면 손익분기점에 도달해요.`;
  }, [numbers.breakEvenDays, numbers.remaining]);

  return (
    <Wrap>
      <Header>
        <Title>간병인보험 손익분기점 계산기</Title>
        <Desc>ver.1.0.002</Desc>
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
              <Input inputMode="numeric" value={form.age} onChange={handleChange('age')} placeholder="예) 45" />
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
              <Input inputMode="numeric" value={form.payCount} onChange={handleChange('payCount')} placeholder="예) 240" />
              {errors.payCount ? <Error>{errors.payCount}</Error> : <Helper>숫자만 입력</Helper>}
            </Field>

            <Field>
              <Label>종신 기준</Label>
              <Select value={String(form.lifelongBasis)} onChange={handleChange('lifelongBasis')}>
                <option value="90">90</option>
                <option value="100">100</option>
              </Select>
              <Helper>현재는 90/100 고정</Helper>
            </Field>

            <Field>
              <Label>일 지급 금액</Label>
              <Input inputMode="numeric" value={form.dailyPay} onChange={handleChange('dailyPay')} placeholder="예) 150000" />
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

            {/* ✅ 새 문구/영역 */}
            {numbers.breakEvenDays !== null && (
              <BreakEvenCallout>
                <CalloutTitle>한 줄 요약</CalloutTitle>
                <CalloutText>{breakEvenSentence}</CalloutText>

                {numbers.remaining ? (
                  <CalloutSub>
                    종신 {form.lifelongBasis}세 기준 <b>{numbers.remaining.targetDateText}</b>까지 약{' '}
                    <b>{numbers.remaining.remainingDays.toLocaleString('ko-KR')}일</b> 남았다고 가정해요.
                    <br />
                    {/* <Hint>* 생일 정보가 없어서 “오늘 기준 나이를 만족하는 생일”로 추정해 계산합니다.</Hint> */}
                  </CalloutSub>
                ) : (
                  <CalloutSub>
                    <Hint>* “앞으로 남은 날 대비” 계산을 보려면 현재 나이를 입력해주세요.</Hint>
                  </CalloutSub>
                )}
              </BreakEvenCallout>
            )}

            <Note>
              * 손익분기 일수 = ⌊총보험료 ÷ 일 지급 금액⌋, 개월 = ⌊일수 ÷ 30⌋ 기준
            </Note>
          </ResultBox>

          <Summary>
            <SummaryTitle>{form.name ? `${form.name}님의 입력 요약` : '입력 요약'}</SummaryTitle>
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

// ✅ 새 콜아웃 스타일
const BreakEvenCallout = styled.div`
  margin-top: 12px;
  border-radius: 14px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
`;

const CalloutTitle = styled.div`
  font-size: 12px;
  opacity: 0.8;
  font-weight: 700;
  margin-bottom: 6px;
`;

const CalloutText = styled.div`
  font-size: 14px;
  line-height: 1.4;
  font-weight: 700;
`;

const CalloutSub = styled.div`
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.8;
  line-height: 1.45;

  b {
    opacity: 0.95;
  }
`;

const Hint = styled.span`
  display: inline-block;
  margin-top: 4px;
  opacity: 0.75;
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
