import React, { useState, useEffect } from 'react';
import { Text } from '@chakra-ui/react';

export function TypingText({
  text,
  highlight = '',
  speed = 100,
  cursor = true,
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;
      if (index > text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  useEffect(() => {
    if (!cursor) return;
    const cursorInterval = setInterval(() => {
      setShowCursor((v) => !v);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, [cursor]);

  const highlightStart = text.indexOf(highlight);

  let normalPart = displayedText;
  let highlightPart = '';

  if (
    highlight &&
    highlightStart !== -1 &&
    displayedText.length > highlightStart
  ) {
    normalPart = displayedText.slice(0, highlightStart);
    highlightPart = displayedText.slice(highlightStart);
  }

  return (
    <Text as="span" whiteSpace="pre">
      {normalPart}
      {highlightPart && (
        <Text as="span" display="inline" color="blue.400">
          {highlightPart}
        </Text>
      )}
      {cursor && showCursor && (
        <Text as="span" display="inline-block" ml={1} color="blue.400">
          |
        </Text>
      )}
    </Text>
  );
}
