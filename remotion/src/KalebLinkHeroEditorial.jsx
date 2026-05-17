import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

function clamp(frame, input, output, easing = easeOut) {
  return interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
}

export function KalebLinkHeroEditorial() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intro = clamp(frame, [0, 1.1 * fps], [0, 1]);
  const loop = frame % (8 * fps);
  const breathe = clamp(loop, [0, 4 * fps, 8 * fps], [0, 1, 0], easeInOut);
  const sweep = clamp(loop, [0.6 * fps, 3.4 * fps, 8 * fps], [-24, 118, 118], easeInOut);
  const glint = clamp(loop, [1.2 * fps, 2.4 * fps, 5.4 * fps, 6.6 * fps], [0, 1, 1, 0], easeInOut);

  return (
    <AbsoluteFill style={{ background: "oklch(5% 0.01 36)", overflow: "hidden" }}>
      <Img
        src={staticFile("assets/kaleb-aguiar/hero-debutante-roxo-escadaria.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "72% 10%",
          filter: "brightness(1.05) contrast(1.06) saturate(1.04)",
          transform: `scale(${1.035 + breathe * 0.035}) translate3d(${-18 + breathe * 10}px, ${-20 + breathe * 16}px, 0)`,
        }}
      />

      <AbsoluteFill
        style={{
          opacity: intro,
          background:
            "linear-gradient(90deg, oklch(4% 0.01 36 / 0.94) 0%, oklch(5% 0.01 36 / 0.7) 34%, oklch(5% 0.01 36 / 0.05) 68%), linear-gradient(0deg, oklch(5% 0.01 36 / 0.74), transparent 48%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 34,
          top: 70,
          width: 520,
          height: 920,
          borderRadius: "48% 48% 8% 8%",
          border: "2px solid oklch(74% 0.13 82 / 0.22)",
          opacity: 0.48 * intro,
          boxShadow: "inset 0 0 100px oklch(74% 0.13 82 / 0.1), 0 0 120px oklch(78% 0.09 18 / 0.08)",
          transform: `translate3d(${breathe * 14}px, ${breathe * -10}px, 0)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "54%",
          height: "100%",
          opacity: glint * 0.58,
          background:
            "radial-gradient(circle at 52% 38%, oklch(88% 0.055 82 / 0.24), transparent 12rem), radial-gradient(circle at 70% 14%, oklch(78% 0.09 18 / 0.18), transparent 16rem)",
          mixBlendMode: "screen",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: `${sweep}%`,
          width: 150,
          height: "120%",
          opacity: 0.56,
          background: "linear-gradient(90deg, transparent, oklch(94% 0.018 82 / 0.25), transparent)",
          transform: "skewX(-17deg)",
          mixBlendMode: "screen",
          filter: "blur(1px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 28,
          opacity: 0.54 * intro,
          border: "1px solid oklch(74% 0.13 82 / 0.18)",
          boxShadow: "inset 0 0 70px oklch(74% 0.13 82 / 0.045)",
        }}
      />
    </AbsoluteFill>
  );
}
