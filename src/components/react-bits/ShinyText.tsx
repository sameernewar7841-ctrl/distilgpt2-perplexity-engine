'use client';

import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export function ShinyText({
  text,
  disabled = false,
  speed = 4.5,
  className = '',
}: ShinyTextProps) {
  return (
    <span
      className={`inline-block font-inherit ${
        disabled
          ? 'text-[#F4F4F5]'
          : 'animate-shine bg-gradient-to-r from-[#F4F4F5] via-[#FFAE52] to-[#F4F4F5] bg-[length:250%_100%] bg-clip-text text-transparent'
      } ${className}`}
      style={{
        animationDuration: `${speed}s`,
      }}
    >
      {text}
    </span>
  );
}
