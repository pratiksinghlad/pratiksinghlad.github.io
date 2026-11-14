import { useState } from "react";
import { litTechIds, principleIdsForTech, type Spotlight } from "./data/portfolio";

export function useSpotlight() {
  const [pinned, setPinned] = useState<Spotlight | null>(null);
  const [hovered, setHovered] = useState<Spotlight | null>(null);
  const active = hovered ?? pinned;

  return {
    pinnedPrinciple: matchId(pinned, "principle"),
    pinnedTech: matchId(pinned, "tech"),
    relatedPrinciples: active?.kind === "tech" ? principleIdsForTech(active.id) : null,
    techFocus: active?.kind === "tech",
    litIds: litTechIds(active),
    hoverPrinciple: (id: string | null) => setHovered(toTarget("principle", id)),
    hoverTech: (id: string | null) => setHovered(toTarget("tech", id)),
    togglePrinciple: (id: string) => setPinned((current) => toggleTarget(current, "principle", id)),
    toggleTech: (id: string) => setPinned((current) => toggleTarget(current, "tech", id)),
  };
}

function matchId(target: Spotlight | null, kind: Spotlight["kind"]): string | null {
  if (target?.kind !== kind) return null;
  return target.id;
}

function toTarget(kind: Spotlight["kind"], id: string | null): Spotlight | null {
  if (id === null) return null;
  return { kind, id };
}

function toggleTarget(
  current: Spotlight | null,
  kind: Spotlight["kind"],
  id: string,
): Spotlight | null {
  if (current?.kind === kind && current.id === id) return null;
  return { kind, id };
}
