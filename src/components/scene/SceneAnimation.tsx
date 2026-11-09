import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

const SceneAnimationContext = createContext(true);

/** One motion preference for the camera, fan rotors and lighting in this scene. */
export function SceneAnimationProvider({
  animated = true,
  children,
}: {
  animated?: boolean;
  children: ReactNode;
}) {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return (
    <SceneAnimationContext.Provider value={animated && !reducedMotion}>
      {children}
    </SceneAnimationContext.Provider>
  );
}

export function useSceneAnimation() {
  return useContext(SceneAnimationContext);
}
