import { useRef, useEffect, useCallback, useState } from 'react';

export function useAutoScroll(deps = []) {
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const userScrolledRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 40;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    setIsAtBottom(atBottom);
    userScrolledRef.current = !atBottom;
  }, []);

  useEffect(() => {
    if (!userScrolledRef.current) {
      scrollToBottom();
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { containerRef, isAtBottom, scrollToBottom, handleScroll };
}
