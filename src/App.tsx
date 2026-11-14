import { ConnectLinks } from "./components/ConnectLinks";
import { Identity } from "./components/Identity";
import { Principles } from "./components/Principles";
import { TechStack } from "./components/TechStack";
import { EmailIcon } from "./components/icons";
import { CONTACT_LABEL, contactHref } from "./data/portfolio";
import { useSpotlight } from "./useSpotlight";

export default function App() {
  const spot = useSpotlight();

  return (
    <main className="app">
      <header className="intro">
        <Identity />
        <div className="actions">
          <a className="action" href={contactHref()}>
            <EmailIcon />
            {CONTACT_LABEL}
          </a>
          <ConnectLinks />
        </div>
      </header>
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
  );
}
