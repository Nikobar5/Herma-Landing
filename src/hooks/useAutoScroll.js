import { useRef, useEffect, useCallback, useState } from 'react';

export function useAutoScroll(deps = [], { isStreaming = false } = {}) {
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasOverflow, setHasOverflow] = useState(false);
  const userScrolledRef = useRef(false);

  const checkOverflow = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setHasOverflow(el.scrollHeight > el.clientHeight + 10);
  }, []);

  const scrollToBottom = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'instant' });
    }
  }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 100;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    setIsAtBottom(atBottom);
    setHasOverflow(el.scrollHeight > el.clientHeight + 10);
    userScrolledRef.current = !atBottom;
  }, []);

  useEffect(() => {
    if (!userScrolledRef.current) {
      scrollToBottom();
    }
    checkOverflow();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  // Show scroll button only when there's overflow AND user isn't at bottom
  const showScrollButton = hasOverflow && !isAtBottom;

  return { containerRef, isAtBottom, showScrollButton, scrollToBottom, handleScroll };
}
