'use client';

import React, { useEffect, useState } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  characters?: string;
  className?: string;
}

export function DecryptedText({
  text,
  speed = 35,
  characters = '0123456789ABCDEF!@#$*&',
  className = '',
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState<string>(text);

  useEffect(() => {
    let iteration = 0;
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
      }

      iteration += 1 / 2;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, characters]);

  return (
    <span className={`font-mono text-[#F4F4F5] tracking-tight ${className}`}>
      {displayText}
    </span>
  );
}
