import { useEffect, useState } from "react";

const PAUSED = "paused";
const RUNNING = "running";

export function useMotionPause() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    document.documentElement.dataset["motion"] = paused ? PAUSED : RUNNING;
    return () => {
      delete document.documentElement.dataset["motion"];
    };
  }, [paused]);
  return { paused, toggle: () => setPaused((current) => !current) };
}
