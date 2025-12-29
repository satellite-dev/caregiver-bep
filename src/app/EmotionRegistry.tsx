'use client';

import * as React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import type { EmotionCache } from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';

function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}

export default function EmotionRegistry({ children }: { children: React.ReactNode }) {
  const [{ cache, flush }] = React.useState(() => {
    const cache = createEmotionCache();
    cache.compat = true;

    // ✅ insert 함수 타입/튜플 파라미터 타입을 정확히 가져옴
    const prevInsert = cache.insert as EmotionCache['insert'];
    type InsertArgs = Parameters<EmotionCache['insert']>;

    let inserted: string[] = [];

    cache.insert = ((...args: InsertArgs) => {
      const serialized = args[1]; // SerializedStyles
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args); // ✅ 이제 args가 튜플이라 에러 없음
    }) as EmotionCache['insert'];

    const flush = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;

    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }

    return (
      <style
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
