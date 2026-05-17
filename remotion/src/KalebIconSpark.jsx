import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

export function KalebIconSpark() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inValue = interpolate(frame, [0, 0.9 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const pulse = interpolate(frame % (2.4 * fps), [0, 1.2 * fps, 2.4 * fps], [0.8, 1, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  return (
    <AbsoluteFill style={{ background: "transparent", display: "grid", placeItems: "center" }}>
      <svg viewBox="0 0 512 512" style={{ width: 512, height: 512, opacity: inValue }}>
        <defs>
          <linearGradient id="sparkGold" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#ffe8a6" />
            <stop offset="0.48" stopColor="#d5a63a" />
            <stop offset="1" stopColor="#fff2c6" />
          </linearGradient>
        </defs>
        <circle
          cx="256"
          cy="256"
          r={190 * pulse}
          fill="rgba(213,166,58,0.08)"
          stroke="rgba(213,166,58,0.5)"
          strokeWidth="4"
        />
        <path
          d="M256 80 295 205 425 205 319 280 360 404 256 328 152 404 193 280 87 205 217 205Z"
          fill="none"
          stroke="url(#sparkGold)"
          strokeWidth="16"
          strokeLinejoin="round"
          transform={`translate(256 256) scale(${interpolate(inValue, [0, 1], [0.82, 1])}) translate(-256 -256)`}
        />
        <circle cx="256" cy="256" r="22" fill="url(#sparkGold)" />
      </svg>
    </AbsoluteFill>
  );
}
