# 보험 계산기 (Insurance Calculator)

Version: 1.0.0

Status: Active

---

# 1. 프로젝트 개요

보험 관련 보장금액 및 손익분기점을 쉽고 빠르게 계산할 수 있는 웹 기반 계산기 서비스.

서버 및 DB 없이 브라우저(Client Side)에서만 동작한다.

---

# 2. 목표

사용자가 보험 가입 시 필요한 보장 금액과 손익분기점을 직관적으로 계산할 수 있도록 지원한다.

현재 지원 기능

1. 간병인 보험 손익분기점 계산기
2. 장기요양 치매 보험계산기
3. 3대 질병 진단비 계산기

---

# 3. 기술 스택

## Framework

- Next.js App Router

## Language

- TypeScript

## Styling

- Emotion

## Deployment

- Vercel

## PWA

- Service Worker
- Web App Manifest

## Data Storage

없음

모든 계산은 클라이언트에서 수행

---

# 4. 프로젝트 구조

```txt
src
├─ app
│  ├─ page.tsx
│  ├─ ltc-dementia
│  │   └─ page.tsx
│  └─ cancer-diagnosis
│      └─ page.tsx
│
├─ components
│  └─ ui
│
└─ lib
```

---

# 5. 공통 개발 원칙

## Import 규칙

상대경로 import 사용 금지

사용

```ts
import { ... } from '@/components/ui';
import { ... } from '@/lib';
```

금지

```ts
import { ... } from '../../components/ui';
```

---

## UI 재사용

공통 UI는

```txt
src/components/ui
```

에서 관리한다.

신규 계산기 추가 시 기존 공통 UI를 우선 사용한다.

---

## 유틸 재사용

숫자 처리

```ts
onlyDigits()
safeInt()
toKRW()
toManwon()
```

공통 사용

---

# 6. 계산기 목록

---

# 6-1. 간병인 보험 손익분기점 계산기

URL

```txt
/
```

목적

간병인 보험 가입 시 손익분기점을 계산한다.

주요 계산식

```txt
총 보험료
=
월 보험료 × 납입 횟수
```

```txt
손익분기점
=
총 보험료 ÷ 일 지급 금액
```

추가 결과

```txt
남은 기대 수명 대비
몇 일만 입원하면 손익분기점 도달
```

지원

* 결과 복사
* PWA

---

# 6-2. 장기요양 치매 보험계산기

URL

```txt
/ltc-dementia
```

목적

장기요양 관련 보험의 손익분기점을 계산한다.

입력

* 보험료1 (복지용구)
* 보험료2 (노치원)
* 보험료3 (재가)

수령액

* 복지용구 수령액
* 노치원 수령액
* 재가 수령액

계산식

```txt
월 보험료
=
보험료1 + 보험료2 + 보험료3
```

```txt
총 납부 예정 금액
=
월 보험료 × 납입 횟수
```

```txt
월 연금 수령액
=
복지용구 + 노치원 + 재가
```

```txt
손익분기점
=
총 납부 예정 금액
÷
월 연금 수령액
```

표시

```txt
nn.n개월 (nn일)
```

지원

* 결과 복사
* PWA

---

# 6-3. 3대 질병 진단비 계산기

URL

```txt
/cancer-diagnosis
```

목적

암, 뇌혈관질환, 허혈성 심장질환 발생 시 필요한 권장 진단비를 계산한다.

---

## 월 생활비

입력

* 월 생활비

설명

```txt
암 진단비는 월 생활비 × 24개월 기준으로 계산
```

---

## 암 진단비

계산식

```txt
월 생활비 × 24
```

예시

```txt
2,500,000 × 24
=
60,000,000원
```

---

## 뇌혈관질환 진단비

입력

* 간병인 비용
* 1인실 실부담 비용
* 입원 일수

기본값

```txt
간병인 비용
150,000원

1인실 실부담 비용
400,000원

입원 일수
30일
```

계산식

```txt
(간병인 비용 × 입원 일수)
+
(1인실 실부담 비용 × 입원 일수)
+
(월 생활비)
```

설명

```txt
평균 1개월 입원을 기준으로
간병비, 1인실 실부담 비용,
월 생활비를 반영
```

---

## 허혈성 심장질환 진단비

입력

* 간병인 비용
* 1인실 실부담 비용
* 입원 일수

기본값

```txt
간병인 비용
150,000원

1인실 실부담 비용
400,000원

입원 일수
40일
```

계산식

```txt
(간병인 비용 × 입원 일수)
+
(1인실 실부담 비용 × 입원 일수)
+
(월 생활비)
```

설명

```txt
평균 40일 입원을 기준으로
간병비, 1인실 실부담 비용,
월 생활비를 반영
```

---

## 1인실 비용 정책

평균 1인실 비용

```txt
500,000원
```

실손의료비 보전

```txt
100,000원
```

실부담 비용

```txt
500,000
-
100,000

=

400,000원
```

---

# 7. PWA 정책

현재 계산기별 독립 설치를 지원한다.

Manifest

```txt
manifest-caregiver.webmanifest
manifest-ltc.webmanifest
manifest-cancer.webmanifest
```

각 계산기는 독립적인

```txt
start_url
scope
id
```

를 가진다.

예시

```txt
/
```

```txt
/ltc-dementia
```

```txt
/cancer-diagnosis
```

---

# 8. 캐시 정책

Service Worker Cache Name

현재

```txt
insurance-calculator-v1
```

사용

정책

기능 변경 시 버전 증가

예시

```txt
insurance-calculator-v2
insurance-calculator-v3
```

---

# 9. 향후 계획

예정 계산기

* 암보험 비교 계산기
* 종신보험 계산기
* 실손보험 계산기
* 연금보험 계산기

예정 기능

* 계산기 목록 메인 페이지
* 결과 공유
* URL 상태 저장
* 계산 이력 저장
* 다크모드/라이트모드
* 계산기 검색

---

# 10. 비목표 (Out of Scope)

현재 프로젝트는 아래 기능을 제공하지 않는다.

* 회원가입
* 로그인
* DB 저장
* 서버 API
* 보험 상품 추천
* 보험료 실시간 조회
* 보험사 연동

모든 계산은 참고용으로 제공한다.
