export function onlyDigits(v: string) {
  return v.replace(/[^\d]/g, '');
}

export function safeInt(v: string) {
  if (!v) return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.floor(n);
}

export function toKRW(n: number) {
  return `${Math.floor(n).toLocaleString('ko-KR')}원`;
}

export function round1(n: number) {
  return Math.round(n * 10) / 10;
}
