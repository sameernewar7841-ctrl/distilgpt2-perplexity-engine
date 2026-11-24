'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  characters?: string;
  className?: string;
  interactive?: boolean;
}

export function DecryptedText({
  text,
  speed = 30,
  characters = '0123456789ABCDEF!@#$*&~%+',
  className = '',
  interactive = true,
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const runScramble = useCallback(() => {
    let iteration = 0;
    setIsScrambling(true);
    const interval = setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '/' || char === '-') return char;
            if (index < iteration) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsScrambling(false);
      }

      iteration += 1 / 2;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, characters]);

  useEffect(() => {
    const cleanup = runScramble();
    return () => {
      if (cleanup) cleanup();
    };
  }, [runScramble]);

  const handleMouseEnter = () => {
    if (interactive && !isScrambling) {
      runScramble();
    }
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      className={`font-mono text-[#F4F4F5] tracking-tight cursor-default select-none ${className}`}
      title="Interactive cipher reveal (React Bits)"
    >
      {displayText}
    </span>
  );
}
