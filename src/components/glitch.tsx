"use client";

import React, { useState, useEffect } from "react";
import { JetBrains_Mono } from "next/font/google";

const jetBrainsMono = JetBrains_Mono({ weight: "800", subsets: ["latin"] });

type GlitchProps = {
  children: string;
  glitchChars?: string;
  glitchInterval?: number;
};

function shuffle(array: string[]): string[] {
  // Fisher-Yates shuffle
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getUniqueGlitchedText(text: string, glitchChars: string): string {
  const needed = text.length;
  const chars = glitchChars.split("");
  if (needed <= chars.length) {
    // Use a unique replacement for each character
    return shuffle(chars).slice(0, needed).join("");
  } else {
    // For extra positions, use unique letters as far as possible, then fill with random ones.
    const uniquePart = shuffle(chars);
    const extraCount = needed - uniquePart.length;
    const extras = Array.from({ length: extraCount }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    );
    return uniquePart.concat(extras).join("");
  }
}

export default function Glitch({
  children,
  glitchChars = "αβγδεζηθικλμνξοπρστυφχψω",
  glitchInterval = 300,
}: GlitchProps) {
  const [glitchedText, setGlitchedText] = useState(children);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGlitchedText(getUniqueGlitchedText(children, glitchChars));
    }, glitchInterval);
    return () => clearInterval(intervalId);
  }, [children, glitchChars, glitchInterval]);

  return (
    <span className={`${jetBrainsMono.className} text-purple-600`}>
      {glitchedText}
    </span>
  );
}