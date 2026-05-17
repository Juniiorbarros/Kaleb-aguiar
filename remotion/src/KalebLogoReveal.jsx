import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

function DressMark({ progress }) {
  return (
    <svg
      viewBox="0 0 180 260"
      style={{
        width: 128,
        height: 184,
        opacity: progress,
        filter: "drop-shadow(0 16px 24px rgba(0,0,0,0.38))",
      }}
    >
      <defs>
        <linearGradient id="dressGold" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#f4dc91" />
          <stop offset="0.48" stopColor="#c9962e" />
          <stop offset="1" stopColor="#fff1b9" />
        </linearGradient>
      </defs>
      <path
        d="M90 14c16 0 28 12 28 28 0 13-8 23-20 27l12 33 46 126H24l46-126 12-33c-12-4-20-14-20-27 0-16 12-28 28-28Z"
        fill="url(#dressGold)"
        transform={`translate(0 ${interpolate(progress, [0, 1], [18, 0])}) scale(${interpolate(progress, [0, 1], [0.92, 1])})`}
      />
      <path d="M55 228c23-44 47-44 70 0" fill="none" stroke="#805c17" strokeWidth="4" opacity="0.55" />
    </svg>
  );
}

export function KalebLogoReveal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mark = interpolate(frame, [0, 0.9 * fps], [0.86, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const name = interpolate(frame, [0, 1.2 * fps], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const descriptor = interpolate(frame, [0, 1.4 * fps], [0.86, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const ring = interpolate(frame, [0, 1.6 * fps], [0.82, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const shimmer = interpolate(frame % (3 * fps), [0, 1.6 * fps, 3 * fps], [-42, 128, 128], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  return (
    <AbsoluteFill style={{ background: "transparent", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 46%, rgba(218,169,66,0.28), rgba(9,7,5,0.94) 46%, rgba(4,3,2,0.98))",
          borderRadius: "50%",
          transform: `scale(${interpolate(ring, [0, 1], [0.88, 1])})`,
          opacity: ring,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 38,
          border: "2px solid rgba(222,177,76,0.55)",
          borderRadius: "50%",
          opacity: ring,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 104,
          top: 152,
          transform: `translateX(${interpolate(mark, [0, 1], [-28, 0])}px)`,
        }}
      >
        <DressMark progress={mark} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 226,
          top: 154,
          color: "#efd982",
          opacity: name,
          transform: `translateX(${interpolate(name, [0, 1], [30, 0])}px)`,
          textShadow: "0 10px 22px rgba(0,0,0,0.62)",
        }}
      >
        <div style={{ fontFamily: "Georgia, serif", fontSize: 112, fontStyle: "italic", lineHeight: 0.78 }}>
          Kaleb
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 110, fontStyle: "italic", lineHeight: 0.76, marginLeft: 24 }}>
          Aguiar
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 116,
          right: 116,
          top: 356,
          height: 3,
          background: "linear-gradient(90deg, transparent, #dcae43, transparent)",
          opacity: descriptor,
          transform: `scaleX(${descriptor})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 122,
          right: 122,
          top: 382,
          textAlign: "center",
          color: "#e1b548",
          fontFamily: "Arial, sans-serif",
          fontWeight: 800,
          fontSize: 36,
          letterSpacing: 13,
          textTransform: "uppercase",
          opacity: descriptor,
          transform: `translateY(${interpolate(descriptor, [0, 1], [18, 0])}px)`,
        }}
      >
        Designer de moda
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 76,
          transform: `translateX(${shimmer}%) skewX(-18deg)`,
          background: "linear-gradient(90deg, transparent, rgba(255,240,177,0.2), transparent)",
          opacity: 0.75,
        }}
      />
    </AbsoluteFill>
  );
}
