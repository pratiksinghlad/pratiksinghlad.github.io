import type { FocusEvent, PointerEvent } from "react";
import { PRINCIPLES, type Principle } from "../data/portfolio";
import { PrincipleScene } from "./scenes";

interface PrinciplesProps {
  pinnedId: string | null;
  relatedIds: ReadonlySet<string> | null;
  filtering: boolean;
  onHover: (id: string | null) => void;
  onToggle: (id: string) => void;
}

export function Principles({
  pinnedId,
  relatedIds,
  filtering,
  onHover,
  onToggle,
}: PrinciplesProps) {
  return (
    <section className="principles-section">
      <h2 className="section-title">Principles</h2>
      <ul
        className="principles"
        role="list"
        data-filtering={flag(filtering)}
      >
        {PRINCIPLES.map((principle) => (
          <li key={principle.id}>
            <PrincipleCard
              principle={principle}
              pressed={pinnedId === principle.id}
              related={relatedIds?.has(principle.id) ?? false}
              onHover={onHover}
              onToggle={onToggle}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function PrincipleCard({
  principle,
  pressed,
  related,
  onHover,
  onToggle,
}: {
  principle: Principle;
  pressed: boolean;
  related: boolean;
  onHover: (id: string | null) => void;
  onToggle: (id: string) => void;
}) {
  const className = related ? "principle glass is-related" : "principle glass";
  return (
    <button
      type="button"
      className={className}
      aria-pressed={pressed}
      onPointerEnter={(event) => enterCard(event, principle.id, onHover)}
      onPointerLeave={(event) => leaveCard(event, onHover)}
      onFocus={(event) => focusCard(event, principle.id, onHover)}
      onBlur={() => onHover(null)}
      onClick={() => onToggle(principle.id)}
    >
      <PrincipleScene id={principle.id} />
      <span className="principle-label">{principle.label}</span>
      <span className="principle-line">{principle.line}</span>
    </button>
  );
}

function enterCard(
  event: PointerEvent<HTMLButtonElement>,
  id: string,
  onHover: (id: string | null) => void,
): void {
  if (event.pointerType === "mouse") onHover(id);
}

function leaveCard(
  event: PointerEvent<HTMLButtonElement>,
  onHover: (id: string | null) => void,
): void {
  if (event.pointerType === "mouse") onHover(null);
}

function focusCard(
  event: FocusEvent<HTMLButtonElement>,
  id: string,
  onHover: (id: string | null) => void,
): void {
  if (event.currentTarget.matches(":focus-visible")) onHover(id);
}

function flag(value: boolean): "true" | "false" {
  return value ? "true" : "false";
}
