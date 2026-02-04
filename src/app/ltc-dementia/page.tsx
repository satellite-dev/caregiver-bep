'use client';

import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import {
  Wrap,
  Header,
  Title,
  Desc,
  Grid,
  Card,
  CardTitle,
  Divider,
  ResultBox,
  Summary,
  SummaryTitle,
  SummaryList,
  Form,
  Field,
  Label,
  Input,
  ReadonlyBox,
  Helper,
  Error,
  TwoCol,
  ThreeRow,
  Section,
  SectionTitle,
  ResultRow,
  K,
  V,
  Small,
  Muted,
  Actions,
  Btn,
} from '@/components/ui';

import { onlyDigits, safeInt, toKRW, round1 } from '@/lib';


type FormState = {
  name: string;
  age: string;

  premiumTool: string; // 보험료1(복지용구)
  receiveTool: string; // 복지용구 수령액

  premiumDaycare: string; // 보험료2(노치원)
  receiveDaycare: string; // 노치원 수령액

  premiumHome: string; // 보험료3(재가)
  receiveHome: string; // 재가 수령액

  payCount: string; // 납입 횟수
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const DEFAULT_FORM: FormState = {
  name: '',
  age: '',
  premiumTool: '',
  receiveTool: '',
  premiumDaycare: '',
  receiveDaycare: '',
  premiumHome: '',
  receiveHome: '',
  payCount: '',
};

function calcErrors(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  const age = safeInt(form.age);
  const payCount = safeInt(form.payCount);

  const premiumTool = safeInt(form.premiumTool);
  const premiumDaycare = safeInt(form.premiumDaycare);
  const premiumHome = safeInt(form.premiumHome);

  const receiveTool = safeInt(form.receiveTool);
  const receiveDaycare = safeInt(form.receiveDaycare);
  const receiveHome = safeInt(form.receiveHome);

  if (form.age && (age === null || age < 0)) errors.age = '현재 나이는 0 이상 정수로 입력해주세요.';

  // 보험료/수령액: 0 이상 허용
  if (form.premiumTool && (premiumTool === null || premiumTool < 0)) errors.premiumTool = '0 이상 정수로 입력해주세요.';
  if (form.premiumDaycare && (premiumDaycare === null || premiumDaycare < 0))
    errors.premiumDaycare = '0 이상 정수로 입력해주세요.';
  if (form.premiumHome && (premiumHome === null || premiumHome < 0)) errors.premiumHome = '0 이상 정수로 입력해주세요.';

  if (form.receiveTool && (receiveTool === null || receiveTool < 0)) errors.receiveTool = '0 이상 정수로 입력해주세요.';
  if (form.receiveDaycare && (receiveDaycare === null || receiveDaycare < 0))
    errors.receiveDaycare = '0 이상 정수로 입력해주세요.';
  if (form.receiveHome && (receiveHome === null || receiveHome < 0)) errors.receiveHome = '0 이상 정수로 입력해주세요.';

  // 납입 횟수: 총 납부 예정 금액 계산에 필수 (0 이상)
  if (form.payCount && (payCount === null || payCount < 0)) errors.payCount = '납입 횟수는 0 이상 정수로 입력해주세요.';

  return errors;
}

export default function Page() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const errors = useMemo(() => calcErrors(form), [form]);

  const computed = useMemo(() => {
    const premiumTool = safeInt(form.premiumTool) ?? 0;
    const premiumDaycare = safeInt(form.premiumDaycare) ?? 0;
    const premiumHome = safeInt(form.premiumHome) ?? 0;

    const receiveTool = safeInt(form.receiveTool) ?? 0;
    const receiveDaycare = safeInt(form.receiveDaycare) ?? 0;
    const receiveHome = safeInt(form.receiveHome) ?? 0;

    const payCount = safeInt(form.payCount) ?? 0;

    // 월 보험료 / 월 연금 수령액
    const monthlyPremium = premiumTool + premiumDaycare + premiumHome;
    const monthlyPension = receiveTool + receiveDaycare + receiveHome;

    // ✅ 확정: 총 납부 예정 금액 = 월 보험료 × 납입 횟수
    const totalPlannedPay = monthlyPremium * payCount;

    // 손익분기점(개월) = 총 납부 예정 금액 ÷ 월 연금 수령액
    const breakEvenMonthsRaw = monthlyPension > 0 ? totalPlannedPay / monthlyPension : null;

    // ✅ 포맷 정책
    // - 달: 1자리 반올림
    // - 일: 실제 계산값 기준 floor(개월 × 30)
    const breakEvenMonthsRounded = breakEvenMonthsRaw !== null ? round1(breakEvenMonthsRaw) : null;
    const breakEvenDays = breakEvenMonthsRaw !== null ? Math.floor(breakEvenMonthsRaw * 30) : null;

    return {
      payCount,
      premiumTool,
      premiumDaycare,
      premiumHome,
      receiveTool,
      receiveDaycare,
      receiveHome,
      monthlyPremium,
      monthlyPension,
      totalPlannedPay,
      breakEvenMonthsRaw,
      breakEvenMonthsRounded,
      breakEvenDays,
    };
  }, [
    form.premiumTool,
    form.premiumDaycare,
    form.premiumHome,
    form.receiveTool,
    form.receiveDaycare,
    form.receiveHome,
    form.payCount,
  ]);

  const isCalcReady =
    Object.keys(errors).length === 0 &&
    computed.payCount >= 0 &&
    computed.monthlyPension > 0;

  const handleChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;

      // 숫자 입력 필드들
      if (
        key === 'age' ||
        key === 'premiumTool' ||
        key === 'receiveTool' ||
        key === 'premiumDaycare' ||
        key === 'receiveDaycare' ||
        key === 'premiumHome' ||
        key === 'receiveHome' ||
        key === 'payCount'
      ) {
        setForm((prev) => ({ ...prev, [key]: onlyDigits(v) }));
        return;
      }

      // 텍스트
      setForm((prev) => ({ ...prev, [key]: v }));
    };

  const reset = () => setForm(DEFAULT_FORM);

  const copyResult = async () => {
    const namePart = form.name ? `${form.name}님\n` : '';
    const agePart = form.age ? `현재 나이: ${form.age}세\n` : '';

    const breakEvenText =
      computed.breakEvenMonthsRaw === null
        ? '계산 불가(월 연금 수령액 확인)'
        : `${computed.breakEvenMonthsRounded!.toFixed(1)}달(${computed.breakEvenDays}일)`;

    const text =
      `${namePart}장기요양 치매 보험계산기 결과\n` +
      agePart +
      `월 보험료(합계): ${toKRW(computed.monthlyPremium)}\n` +
      `납입 횟수: ${computed.payCount}회\n` +
      `총 납부 예정 금액: ${toKRW(computed.totalPlannedPay)}\n` +
      `월 연금 수령액(합계): ${toKRW(computed.monthlyPension)}\n` +
      `손익분기점: ${breakEvenText}\n`;

    try {
      await navigator.clipboard.writeText(text);
      alert('결과를 복사했어요.');
    } catch {
      alert('복사에 실패했어요. 브라우저 권한을 확인해주세요.');
    }
  };

  const oneLineSummary = useMemo(() => {
    if (!isCalcReady) return null;

    return `매달 약 ${toKRW(computed.monthlyPension)}을 수령한다면, 약 ${computed.breakEvenMonthsRounded!.toFixed(
      1
    )}달(${computed.breakEvenDays}일) 뒤에 손익분기점에 도달해요.`;
  }, [isCalcReady, computed.monthlyPension, computed.breakEvenMonthsRounded, computed.breakEvenDays]);

  return (
    <Wrap>
      <Header>
        <Title>장기요양 치매 보험계산기</Title>
        <Desc>보험료/수령액을 입력하면 월 기준 손익분기 기간을 계산합니다.</Desc>
      </Header>

      <Grid>
        <Card>
          <CardTitle>입력</CardTitle>

          <Form>
            <TwoCol>
              <Field>
                <Label>이름</Label>
                <Input value={form.name} onChange={handleChange('name')} placeholder="예) 홍길동" />
                <Helper>선택 입력</Helper>
              </Field>

              <Field>
                <Label>현재 나이</Label>
                <Input inputMode="numeric" value={form.age} onChange={handleChange('age')} placeholder="예) 45" />
                {errors.age ? <Error>{errors.age}</Error> : <Helper>선택 입력</Helper>}
              </Field>
            </TwoCol>

            <Section>
              <SectionTitle>보험료 (월)</SectionTitle>
              <ThreeRow>
                <Field>
                  <Label>보험료1 (복지용구)</Label>
                  <Input inputMode="numeric" value={form.premiumTool} onChange={handleChange('premiumTool')} placeholder="예) 12000" />
                  {errors.premiumTool ? <Error>{errors.premiumTool}</Error> : <Helper>{form.premiumTool ? toKRW(Number(form.premiumTool)) : '숫자만 입력'}</Helper>}
                </Field>

                <Field>
                  <Label>보험료2 (노치원)</Label>
                  <Input inputMode="numeric" value={form.premiumDaycare} onChange={handleChange('premiumDaycare')} placeholder="예) 18000" />
                  {errors.premiumDaycare ? <Error>{errors.premiumDaycare}</Error> : <Helper>{form.premiumDaycare ? toKRW(Number(form.premiumDaycare)) : '숫자만 입력'}</Helper>}
                </Field>

                <Field>
                  <Label>보험료3 (재가)</Label>
                  <Input inputMode="numeric" value={form.premiumHome} onChange={handleChange('premiumHome')} placeholder="예) 22000" />
                  {errors.premiumHome ? <Error>{errors.premiumHome}</Error> : <Helper>{form.premiumHome ? toKRW(Number(form.premiumHome)) : '숫자만 입력'}</Helper>}
                </Field>
              </ThreeRow>
            </Section>

            <Section>
              <SectionTitle>수령액 (월)</SectionTitle>
              <ThreeRow>
                <Field>
                  <Label>복지용구 수령액</Label>
                  <Input inputMode="numeric" value={form.receiveTool} onChange={handleChange('receiveTool')} placeholder="예) 50000" />
                  {errors.receiveTool ? <Error>{errors.receiveTool}</Error> : <Helper>{form.receiveTool ? toKRW(Number(form.receiveTool)) : '숫자만 입력'}</Helper>}
                </Field>

                <Field>
                  <Label>노치원 수령액</Label>
                  <Input inputMode="numeric" value={form.receiveDaycare} onChange={handleChange('receiveDaycare')} placeholder="예) 150000" />
                  {errors.receiveDaycare ? <Error>{errors.receiveDaycare}</Error> : <Helper>{form.receiveDaycare ? toKRW(Number(form.receiveDaycare)) : '숫자만 입력'}</Helper>}
                </Field>

                <Field>
                  <Label>재가 수령액</Label>
                  <Input inputMode="numeric" value={form.receiveHome} onChange={handleChange('receiveHome')} placeholder="예) 200000" />
                  {errors.receiveHome ? <Error>{errors.receiveHome}</Error> : <Helper>{form.receiveHome ? toKRW(Number(form.receiveHome)) : '숫자만 입력'}</Helper>}
                </Field>
              </ThreeRow>
            </Section>

            <TwoCol>
              <Field>
                <Label>납입 횟수</Label>
                <Input inputMode="numeric" value={form.payCount} onChange={handleChange('payCount')} placeholder="예) 240" />
                {errors.payCount ? <Error>{errors.payCount}</Error> : <Helper>총 납부 예정 금액 계산에 사용</Helper>}
              </Field>

              <Field>
                <Label>월 보험료 (자동 계산)</Label>
                <ReadonlyBox>{toKRW(computed.monthlyPremium)}</ReadonlyBox>
                <Helper>보험료1 + 보험료2 + 보험료3</Helper>
              </Field>
            </TwoCol>
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
              <K>총 납부 예정 금액</K>
              <V>{toKRW(computed.totalPlannedPay)}</V>
            </ResultRow>

            <Divider />

            <ResultRow>
              <K>월 연금 수령액</K>
              <V>{toKRW(computed.monthlyPension)}</V>
            </ResultRow>

            <Divider />

            <ResultRow>
              <K>손익분기점</K>
              <V>
                {computed.monthlyPension <= 0 ? (
                  <Muted>월 연금 수령액을 1원 이상 입력해주세요.</Muted>
                ) : (
                  <>
                    {computed.breakEvenMonthsRounded!.toFixed(1)}달 <Small>({computed.breakEvenDays}일)</Small>
                  </>
                )}
              </V>
            </ResultRow>

            {oneLineSummary && (
              <Callout>
                <CalloutTitle>한 줄 요약</CalloutTitle>
                <CalloutText>{oneLineSummary}</CalloutText>
                <CalloutHint>* 달은 1자리 반올림, 일은 실제 계산값(개월 × 30) 기준으로 계산합니다.</CalloutHint>
              </Callout>
            )}
          </ResultBox>

          <Summary>
            <SummaryTitle>{form.name ? `${form.name}님의 입력 요약` : '입력 요약'}</SummaryTitle>
            <SummaryList>
              <li>현재 나이: {form.age ? `${form.age}세` : '-'}</li>
              <li>월 보험료: {toKRW(computed.monthlyPremium)}</li>
              <li>납입 횟수: {computed.payCount}회</li>
              <li>월 연금 수령액: {toKRW(computed.monthlyPension)}</li>
            </SummaryList>
          </Summary>
        </Card>
      </Grid>
    </Wrap>
  );
}

/* 페이지 전용(공통화 제외) */
const Callout = styled.div`
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

const CalloutHint = styled.div`
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.75;
  line-height: 1.45;
`;
