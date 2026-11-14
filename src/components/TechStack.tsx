import type { CSSProperties, FocusEvent, PointerEvent } from "react";
import { TECH_STACK, type TechItem } from "../data/portfolio";
import { TechMark } from "./icons";

interface TechStackProps {
  litIds: ReadonlySet<string> | null;
  pinnedId: string | null;
  onHover: (id: string | null) => void;
  onToggle: (id: string) => void;
}

export function TechStack({ litIds, pinnedId, onHover, onToggle }: TechStackProps) {
  const filtering = litIds !== null;
  return (
    <section className="stack" aria-label="Tech stack">
      <ul className="tech-grid" data-filtering={flag(filtering)} data-all={allSelected(litIds)}>
        {TECH_STACK.map((tech) => (
          <li key={tech.id}>
            <TechButton
              tech={tech}
              lit={isLit(litIds, tech.id)}
              filtering={filtering}
              pressed={pinnedId === tech.id}
              onHover={onHover}
              onToggle={onToggle}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function TechButton({
  tech,
  lit,
  filtering,
  pressed,
  onHover,
  onToggle,
}: {
  tech: TechItem;
  lit: boolean;
  filtering: boolean;
  pressed: boolean;
  onHover: (id: string | null) => void;
  onToggle: (id: string) => void;
}) {
  const style = { "--mark": tech.mark } as CSSProperties;
  const className = lit && filtering ? "tech-item is-lit" : "tech-item";
  return (
    <button
      type="button"
      className={className}
      style={style}
      aria-pressed={pressed}
      onPointerEnter={(event) => enterTech(event, tech.id, onHover)}
      onPointerLeave={(event) => leaveTech(event, onHover)}
      onFocus={(event) => focusTech(event, tech.id, onHover)}
      onBlur={() => onHover(null)}
      onClick={() => onToggle(tech.id)}
    >
      <TechMark id={tech.id} />
      <span>{tech.label}</span>
    </button>
  );
}

function enterTech(
  event: PointerEvent<HTMLButtonElement>,
  id: string,
  onHover: (id: string | null) => void,
): void {
  if (event.pointerType === "mouse") onHover(id);
}

function leaveTech(
  event: PointerEvent<HTMLButtonElement>,
  onHover: (id: string | null) => void,
): void {
  if (event.pointerType === "mouse") onHover(null);
}

function focusTech(
  event: FocusEvent<HTMLButtonElement>,
  id: string,
  onHover: (id: string | null) => void,
): void {
  if (event.currentTarget.matches(":focus-visible")) onHover(id);
}

function allSelected(litIds: ReadonlySet<string> | null): "true" | "false" {
  if (!litIds) return "false";
  const every = TECH_STACK.every((tech) => litIds.has(tech.id));
  return every ? "true" : "false";
}

function isLit(litIds: ReadonlySet<string> | null, id: string): boolean {
  if (!litIds) return true;
  return litIds.has(id);
}

function flag(value: boolean): "true" | "false" {
  return value ? "true" : "false";
}
