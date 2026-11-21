import Pause from "lucide-react/icons/pause";
import Play from "lucide-react/icons/play";

const PAUSE_LABEL = "Pause motion";
const PLAY_LABEL = "Play motion";

export function MotionToggle({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  const label = paused ? PLAY_LABEL : PAUSE_LABEL;
  const Icon = paused ? Play : Pause;
  return (
    <button type="button" className="action glass motion-toggle" aria-label={label} onClick={onToggle}>
      <Icon className="icon" aria-hidden="true" />
    </button>
  );
}
