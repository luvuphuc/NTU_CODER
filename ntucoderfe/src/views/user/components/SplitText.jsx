import { animate, stagger } from 'motion';
import { splitText } from 'motion-plus';
import { useEffect, useRef } from 'react';

export default function AnimatedSplitText({
  children,
  as = 'h1',
  className = '',
  animationType = 'words',
  wordClass = 'split-word',
  delay = 0.05,
  duration = 1.5,
  bounce = 0.2,
  style = {},
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    document.fonts.ready.then(() => {
      const container = containerRef.current;
      if (!container) return;

      container.style.visibility = 'visible';

      const target = container.querySelector('[data-animated-text]');
      if (!target) return;

      const result = splitText(target, {
        type: animationType,
        wordClass: wordClass,
        charClass: 'split-char',
      });

      const elements = animationType === 'words' ? result.words : result.chars;

      animate(
        elements,
        { opacity: [0, 1], y: [10, 0] },
        {
          type: 'spring',
          duration,
          bounce,
          delay: stagger(delay),
        },
      );
    });
  }, [animationType, wordClass, delay, duration, bounce]);

  const Tag = as;

  return (
    <div ref={containerRef} style={{ visibility: 'hidden' }}>
      <Tag className={className} data-animated-text style={style}>
        {children}
      </Tag>
      <style>{`
        .split-word, .split-char {
          display: inline-block;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
}
