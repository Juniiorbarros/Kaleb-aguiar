import React from "react";
import { Composition, Folder } from "remotion";
import { KalebLogoReveal } from "./src/KalebLogoReveal.jsx";
import { KalebFlyerMotion } from "./src/KalebFlyerMotion.jsx";
import { KalebIconSpark } from "./src/KalebIconSpark.jsx";

export const RemotionRoot = () => {
  return (
    <Folder name="KalebAguiar">
      <Composition
        id="KalebLogoReveal"
        component={KalebLogoReveal}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="KalebFlyerMotion"
        component={KalebFlyerMotion}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="KalebIconSpark"
        component={KalebIconSpark}
        durationInFrames={120}
        fps={30}
        width={512}
        height={512}
      />
    </Folder>
  );
};
