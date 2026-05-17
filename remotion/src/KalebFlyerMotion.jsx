import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

export function KalebFlyerMotion() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intro = interpolate(frame, [0, 1.2 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const drift = interpolate(frame, [0, 8 * fps], [0, -42], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sweep = interpolate(frame % (4 * fps), [0, 2 * fps, 4 * fps], [-35, 135, 135], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const glow = interpolate(frame % (3 * fps), [0, 1.5 * fps, 3 * fps], [0.28, 0.48, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

  return (
    <AbsoluteFill style={{ background: "#050403", overflow: "hidden" }}>
      <Img
        src={staticFile("assets/kaleb-aguiar/hero-debutante-roxo-escadaria.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "55% 12%",
          filter: "brightness(0.62) contrast(1.08)",
          transform: `scale(1.08) translateY(${drift}px)`,
        }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(5,4,3,0.95), rgba(5,4,3,0.72) 48%, rgba(5,4,3,0.18)), linear-gradient(0deg, rgba(5,4,3,0.95), transparent 46%)", opacity: intro }} />
      <div
        style={{
          position: "absolute",
          right: 120,
          top: 100,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(126,74,185,${glow}) 0%, rgba(220,174,67,0.16) 36%, transparent 68%)`,
          filter: "blur(18px)",
          opacity: intro,
          transform: `scale(${interpolate(intro, [0, 1], [0.85, 1])})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 38,
          border: "2px solid rgba(220,174,67,0.32)",
          opacity: intro,
          boxShadow: "inset 0 0 90px rgba(220,174,67,0.09)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${sweep}%) skewX(-16deg)`,
          width: 180,
          background: "linear-gradient(90deg, transparent, rgba(255,231,177,0.22), transparent)",
          opacity: 0.7,
        }}
      />
    </AbsoluteFill>
  );
}
