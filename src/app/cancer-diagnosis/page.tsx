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
  Helper,
  Error,
  TwoCol,
  SectionTitle,
  ResultRow,
  K,
  V,
  Small,
  Actions,
  Btn,
} from '@/components/ui';
import { onlyDigits, safeInt, toKRW, toManwon } from '@/lib';

type FormState = {
  name: string;
  age: string;
  monthlyLivingCost: string;
  brainCaregiverCost: string;
  brainPrivateRoomCost: string;
  brainHospitalDays: string;
  heartCaregiverCost: string;
  heartPrivateRoomCost: string;
  heartHospitalDays: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const DEFAULT_FORM: FormState = {
  name: '',
  age: '',
  monthlyLivingCost: '2500000',
  brainCaregiverCost: '150000',
  brainPrivateRoomCost: '400000',
  brainHospitalDays: '30',
  heartCaregiverCost: '150000',
  heartPrivateRoomCost: '400000',
  heartHospitalDays: '40',
};

function calcErrors(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  const age = safeInt(form.age);
  const monthlyLivingCost = safeInt(form.monthlyLivingCost);
  const brainCaregiverCost = safeInt(form.brainCaregiverCost);
  const brainPrivateRoomCost = safeInt(form.brainPrivateRoomCost);
  const brainHospitalDays = safeInt(form.brainHospitalDays);
  const heartCaregiverCost = safeInt(form.heartCaregiverCost);
  const heartPrivateRoomCost = safeInt(form.heartPrivateRoomCost);
  const heartHospitalDays = safeInt(form.heartHospitalDays);

  if (form.age && (age === null || age < 0)) errors.age = '현재 나이는 0 이상 정수로 입력해주세요.';
  if (form.monthlyLivingCost && (monthlyLivingCost === null || monthlyLivingCost < 0))
    errors.monthlyLivingCost = '0 이상 정수로 입력해주세요.';
  if (form.brainCaregiverCost && (brainCaregiverCost === null || brainCaregiverCost < 0))
    errors.brainCaregiverCost = '0 이상 정수로 입력해주세요.';
  if (form.brainPrivateRoomCost && (brainPrivateRoomCost === null || brainPrivateRoomCost < 0))
    errors.brainPrivateRoomCost = '0 이상 정수로 입력해주세요.';
  if (form.brainHospitalDays && (brainHospitalDays === null || brainHospitalDays < 0))
    errors.brainHospitalDays = '0 이상 정수로 입력해주세요.';
  if (form.heartCaregiverCost && (heartCaregiverCost === null || heartCaregiverCost < 0))
    errors.heartCaregiverCost = '0 이상 정수로 입력해주세요.';
  if (form.heartPrivateRoomCost && (heartPrivateRoomCost === null || heartPrivateRoomCost < 0))
    errors.heartPrivateRoomCost = '0 이상 정수로 입력해주세요.';
  if (form.heartHospitalDays && (heartHospitalDays === null || heartHospitalDays < 0))
    errors.heartHospitalDays = '0 이상 정수로 입력해주세요.';

  return errors;
}

export default function Page() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const errors = useMemo(() => calcErrors(form), [form]);

  const computed = useMemo(() => {
    const age = safeInt(form.age);
    const monthlyLivingCost = safeInt(form.monthlyLivingCost) ?? 0;
    const brainCaregiverCost = safeInt(form.brainCaregiverCost) ?? 0;
    const brainPrivateRoomCost = safeInt(form.brainPrivateRoomCost) ?? 0;
    const brainHospitalDays = safeInt(form.brainHospitalDays) ?? 0;
    const heartCaregiverCost = safeInt(form.heartCaregiverCost) ?? 0;
    const heartPrivateRoomCost = safeInt(form.heartPrivateRoomCost) ?? 0;
    const heartHospitalDays = safeInt(form.heartHospitalDays) ?? 0;

    const cancerCoverage = monthlyLivingCost * 24;
    const brainCoverage =
      brainCaregiverCost * brainHospitalDays + brainPrivateRoomCost * brainHospitalDays + monthlyLivingCost;
    const heartCoverage =
      heartCaregiverCost * heartHospitalDays + heartPrivateRoomCost * heartHospitalDays + monthlyLivingCost;

    return {
      age,
      monthlyLivingCost,
      brainCaregiverCost,
      brainPrivateRoomCost,
      brainHospitalDays,
      heartCaregiverCost,
      heartPrivateRoomCost,
      heartHospitalDays,
      cancerCoverage,
      brainCoverage,
      heartCoverage,
    };
  }, [
    form.age,
    form.monthlyLivingCost,
    form.brainCaregiverCost,
    form.brainPrivateRoomCost,
    form.brainHospitalDays,
    form.heartCaregiverCost,
    form.heartPrivateRoomCost,
    form.heartHospitalDays,
  ]);

  const isCalcReady = Object.keys(errors).length === 0;

  const handleChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (
        key === 'age' ||
        key === 'monthlyLivingCost' ||
        key === 'brainCaregiverCost' ||
        key === 'brainPrivateRoomCost' ||
        key === 'brainHospitalDays' ||
        key === 'heartCaregiverCost' ||
        key === 'heartPrivateRoomCost' ||
        key === 'heartHospitalDays'
      ) {
        setForm((prev) => ({ ...prev, [key]: onlyDigits(value) }));
        return;
      }

      setForm((prev) => ({ ...prev, [key]: value }));
    };

  const reset = () => setForm(DEFAULT_FORM);

  const copyResult = async () => {
    const namePart = form.name ? `${form.name}님\n` : '';
    const agePart = computed.age !== null ? `현재 나이: ${computed.age}세\n` : '';

    const text =
      `${namePart}3대 질병 진단비 계산 결과\n` +
      agePart +
      `월 생활비: ${toKRW(computed.monthlyLivingCost)}\n\n` +
      `암 진단비\n` +
      `${toKRW(computed.cancerCoverage)} (${toManwon(computed.cancerCoverage)})\n\n` +
      `뇌혈관질환 진단비\n` +
      `${toKRW(computed.brainCoverage)} (${toManwon(computed.brainCoverage)})\n` +
      `- 간병인 비용: ${toKRW(computed.brainCaregiverCost)}\n` +
      `- 1인실 실부담 비용: ${toKRW(computed.brainPrivateRoomCost)}\n` +
      `- 입원 일수: ${computed.brainHospitalDays}일\n\n` +
      `허혈성 심장질환 진단비\n` +
      `${toKRW(computed.heartCoverage)} (${toManwon(computed.heartCoverage)})\n` +
      `- 간병인 비용: ${toKRW(computed.heartCaregiverCost)}\n` +
      `- 1인실 실부담 비용: ${toKRW(computed.heartPrivateRoomCost)}\n` +
      `- 입원 일수: ${computed.heartHospitalDays}일`;

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
        <Title>3대 질병 진단비 계산기</Title>
        <Desc>월 생활비를 기준으로 암, 뇌혈관질환, 허혈성 심장질환 권장 진단비를 계산합니다.</Desc>
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

            <InputSection>
              <SectionTitle>월 생활비</SectionTitle>
              <Field>
                <Input
                  inputMode="numeric"
                  value={form.monthlyLivingCost}
                  onChange={handleChange('monthlyLivingCost')}
                  placeholder="예) 2500000"
                />
                {errors.monthlyLivingCost ? (
                  <Error>{errors.monthlyLivingCost}</Error>
                ) : (
                  <Helper>암 진단비는 월 생활비 × 24개월 기준으로 계산합니다.</Helper>
                )}
              </Field>
            </InputSection>

            <InputSection>
              <SectionTitle>뇌혈관질환 진단비</SectionTitle>
              <TwoCol>
                <Field>
                  <Label>간병인 비용</Label>
                  <Input
                    inputMode="numeric"
                    value={form.brainCaregiverCost}
                    onChange={handleChange('brainCaregiverCost')}
                    placeholder="예) 150000"
                  />
                  {errors.brainCaregiverCost ? (
                    <Error>{errors.brainCaregiverCost}</Error>
                  ) : (
                    <Helper>{form.brainCaregiverCost ? `${toKRW(Number(form.brainCaregiverCost))} / 일` : '숫자만 입력'}</Helper>
                  )}
                </Field>

                <Field>
                  <Label>1인실 실부담 비용</Label>
                  <Input
                    inputMode="numeric"
                    value={form.brainPrivateRoomCost}
                    onChange={handleChange('brainPrivateRoomCost')}
                    placeholder="예) 400000"
                  />
                  {errors.brainPrivateRoomCost ? (
                    <Error>{errors.brainPrivateRoomCost}</Error>
                  ) : (
                    <Helper>
                      {form.brainPrivateRoomCost ? `${toKRW(Number(form.brainPrivateRoomCost))} / 일` : '숫자만 입력'}
                    </Helper>
                  )}
                </Field>
              </TwoCol>

              <Field>
                <Label>입원 일수</Label>
                <Input
                  inputMode="numeric"
                  value={form.brainHospitalDays}
                  onChange={handleChange('brainHospitalDays')}
                  placeholder="예) 30"
                />
                {errors.brainHospitalDays ? (
                  <Error>{errors.brainHospitalDays}</Error>
                ) : (
                  <Helper>평균 1개월 입원을 기준으로 간병비, 1인실 실부담 비용, 월 생활비를 반영합니다.</Helper>
                )}
              </Field>
            </InputSection>

            <InputSection>
              <SectionTitle>허혈성 심장질환 진단비</SectionTitle>
              <TwoCol>
                <Field>
                  <Label>간병인 비용</Label>
                  <Input
                    inputMode="numeric"
                    value={form.heartCaregiverCost}
                    onChange={handleChange('heartCaregiverCost')}
                    placeholder="예) 150000"
                  />
                  {errors.heartCaregiverCost ? (
                    <Error>{errors.heartCaregiverCost}</Error>
                  ) : (
                    <Helper>{form.heartCaregiverCost ? `${toKRW(Number(form.heartCaregiverCost))} / 일` : '숫자만 입력'}</Helper>
                  )}
                </Field>

                <Field>
                  <Label>1인실 실부담 비용</Label>
                  <Input
                    inputMode="numeric"
                    value={form.heartPrivateRoomCost}
                    onChange={handleChange('heartPrivateRoomCost')}
                    placeholder="예) 400000"
                  />
                  {errors.heartPrivateRoomCost ? (
                    <Error>{errors.heartPrivateRoomCost}</Error>
                  ) : (
                    <Helper>
                      {form.heartPrivateRoomCost ? `${toKRW(Number(form.heartPrivateRoomCost))} / 일` : '숫자만 입력'}
                    </Helper>
                  )}
                </Field>
              </TwoCol>

              <Field>
                <Label>입원 일수</Label>
                <Input
                  inputMode="numeric"
                  value={form.heartHospitalDays}
                  onChange={handleChange('heartHospitalDays')}
                  placeholder="예) 40"
                />
                {errors.heartHospitalDays ? (
                  <Error>{errors.heartHospitalDays}</Error>
                ) : (
                  <Helper>평균 40일 입원을 기준으로 간병비, 1인실 실부담 비용, 월 생활비를 반영합니다.</Helper>
                )}
              </Field>
            </InputSection>
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
              <K>암 진단비</K>
              <V>
                {toKRW(computed.cancerCoverage)} <Small>({toManwon(computed.cancerCoverage)})</Small>
              </V>
            </ResultRow>
            <ResultDesc>월 생활비 × 24개월 기준으로 산정한 권장 진단비입니다.</ResultDesc>

            <Divider />

            <ResultRow>
              <K>뇌혈관질환 진단비</K>
              <V>
                {toKRW(computed.brainCoverage)} <Small>({toManwon(computed.brainCoverage)})</Small>
              </V>
            </ResultRow>
            <ResultDesc>간병인 비용, 1인실 실부담 비용, 입원 일수, 월 생활비를 반영한 권장 진단비입니다.</ResultDesc>
            <Formula>(간병인 비용 × 입원 일수) + (1인실 실부담 비용 × 입원 일수) + (월 생활비)</Formula>

            <Divider />

            <ResultRow>
              <K>허혈성 심장질환 진단비</K>
              <V>
                {toKRW(computed.heartCoverage)} <Small>({toManwon(computed.heartCoverage)})</Small>
              </V>
            </ResultRow>
            <ResultDesc>간병인 비용, 1인실 실부담 비용, 입원 일수, 월 생활비를 반영한 권장 진단비입니다.</ResultDesc>
            <Formula>(간병인 비용 × 입원 일수) + (1인실 실부담 비용 × 입원 일수) + (월 생활비)</Formula>
          </ResultBox>

          <Summary>
            <SummaryTitle>{form.name ? `${form.name}님의 입력 요약` : '입력 요약'}</SummaryTitle>
            <SummaryList>
              <li>현재 나이: {computed.age !== null ? `${computed.age}세` : '-'}</li>
              <li>월 생활비: {toKRW(computed.monthlyLivingCost)}</li>
              <li>뇌혈관질환 간병인 비용: {toKRW(computed.brainCaregiverCost)} / 일</li>
              <li>뇌혈관질환 1인실 실부담 비용: {toKRW(computed.brainPrivateRoomCost)} / 일</li>
              <li>뇌혈관질환 입원 일수: {computed.brainHospitalDays}일</li>
              <li>허혈성 심장질환 간병인 비용: {toKRW(computed.heartCaregiverCost)} / 일</li>
              <li>허혈성 심장질환 1인실 실부담 비용: {toKRW(computed.heartPrivateRoomCost)} / 일</li>
              <li>허혈성 심장질환 입원 일수: {computed.heartHospitalDays}일</li>
            </SummaryList>
          </Summary>
        </Card>
      </Grid>
    </Wrap>
  );
}

const ResultDesc = styled.div`
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.45;
  opacity: 0.72;
`;

const InputSection = styled.div`
  display: grid;
  gap: 12px;
  padding-top: 14px;

  & + & {
    margin-top: 12px;
  }
`;

const Formula = styled.div`
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.45;
  opacity: 0.62;
`;
