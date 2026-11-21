import { ConnectLinks } from "./components/ConnectLinks";
import { Identity } from "./components/Identity";
import { MotionToggle } from "./components/MotionToggle";
import { Principles } from "./components/Principles";
import { TechStack } from "./components/TechStack";
import { EmailIcon } from "./components/icons";
import { CONTACT_LABEL, contactHref } from "./data/portfolio";
import { useMotionPause } from "./useMotionPause";
import { useSpotlight } from "./useSpotlight";

export default function App() {
  const spot = useSpotlight();
  const motion = useMotionPause();

  return (
    <div className="app">
      <header className="intro">
        <Identity />
        <div className="actions">
          <nav className="connect" aria-label="Contact">
            <a className="action glass" href={contactHref()}>
              <EmailIcon />
              {CONTACT_LABEL}
            </a>
            <ConnectLinks />
          </nav>
          <MotionToggle paused={motion.paused} onToggle={motion.toggle} />
        </div>
      </header>
      <main>
        <Principles
          pinnedId={spot.pinnedPrinciple}
          relatedIds={spot.relatedPrinciples}
          filtering={spot.techFocus}
          onHover={spot.hoverPrinciple}
          onToggle={spot.togglePrinciple}
        />
        <TechStack
          litIds={spot.litIds}
          pinnedId={spot.pinnedTech}
          onHover={spot.hoverTech}
          onToggle={spot.toggleTech}
        />
      </main>
    </div>
  );
}
