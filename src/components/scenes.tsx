import type { ReactNode } from "react";

const SCENES: Record<string, () => ReactNode> = {
  "ai-native": AgentsScene,
  builder: BuilderScene,
  "problem-solver": SolverScene,
  "critical-thinking": ThinkScene,
  agile: AgileScene,
  learner: LearnerScene,
};

export function PrincipleScene({ id }: { id: string }) {
  const Scene = SCENES[id] ?? LearnerScene;
  return <Scene />;
}

function AgentsScene() {
  return (
    <span className="scene scene-agents" aria-hidden="true">
      <svg className="control-stage" viewBox="0 0 220 120">
        <line className="floor" x1="16" y1="108" x2="208" y2="108" />
        <Signal className="signal-a" d="M52 64 Q 76 46 100 91" />
        <Signal className="signal-b" d="M52 64 Q 104 40 140 91" />
        <Signal className="signal-c" d="M52 64 Q 140 36 178 91" />
        <Agent className="agent-a" x={108} />
        <Agent className="agent-b" x={148} />
        <Agent className="agent-c" x={186} />
        <Guide />
      </svg>
    </span>
  );
}

function Signal({ className, d }: { className: string; d: string }) {
  return (
    <>
      <path className={`link ${className}`} d={d} />
      <circle className={`command ${className}`} r="2.5" style={{ offsetPath: `path('${d}')` }} />
    </>
  );
}

function Agent({ className, x }: { className: string; x: number }) {
  return (
    <g transform={`translate(${x} 108)`}>
      <g className={`agent ${className}`}>
        <circle className="ack" cx="0" cy="-28" r="4.6" />
        <circle className="bot-antenna" cx="0" cy="-28" r="2.2" />
        <path d="M0 -26v3.2" className="bot-stem" />
        <rect className="bot-body" x="-8" y="-22" width="16" height="10" rx="2.2" />
        <circle className="bot-eye" cx="-3.2" cy="-17.2" r="1.15" />
        <circle className="bot-eye" cx="3.2" cy="-17.2" r="1.15" />
        <rect x="-6" y="-12" width="4.2" height="12" rx="1.4" />
        <rect x="1.8" y="-12" width="4.2" height="12" rx="1.4" />
      </g>
    </g>
  );
}

function Guide() {
  return (
    <g className="guide">
      <circle cx="26" cy="60" r="7.4" />
      <rect x="18" y="69" width="16" height="18" rx="5" />
      <g className="baton">
        <path className="guide-arm" d="M30 78 L50 66" />
        <circle className="hand" cx="52" cy="64" r="2.8" />
        <circle className="pulse" cx="52" cy="64" r="3.2" />
      </g>
      <rect x="20" y="87" width="5" height="21" rx="2" />
      <rect x="29" y="87" width="5" height="21" rx="2" />
    </g>
  );
}

function BuilderScene() {
  return (
    <span className="scene scene-build" aria-hidden="true">
      <span className="editor">
        <span className="editor-top">
          <span />
          <span />
          <span />
        </span>
        <span className="editor-body">
          <span className="code">
            <span className="code-line" />
            <span className="code-line code-line-mid" />
            <span className="code-line code-line-short" />
          </span>
          <span className="preview">
            <span className="preview-bar" />
            <span className="preview-card" />
          </span>
        </span>
      </span>
    </span>
  );
}

function SolverScene() {
  return (
    <span className="scene scene-solver" aria-hidden="true">
      <svg className="scene-svg" viewBox="0 0 120 64">
        <path className="puzzle-base" d="M18 16H50V26H42V38H50V48H18Z" />
        <g className="puzzle-piece">
          <path d="M50 16H92V48H50V38H42V26H50Z" />
        </g>
        <path className="solved-mark" d="M54 31.5l4.5 4.5 9-10" />
      </svg>
    </span>
  );
}

function ThinkScene() {
  return (
    <span className="scene scene-think" aria-hidden="true">
      <span className="scale">
        <span className="beam">
          <span className="pan pan-left">
            <span className="weight" />
          </span>
          <span className="pan pan-right">
            <span className="weight weight-right" />
          </span>
        </span>
        <span className="fulcrum" />
        <span className="think-mark" />
      </span>
    </span>
  );
}

function AgileScene() {
  return (
    <span className="scene scene-agile" aria-hidden="true">
      <span className="board">
        <span className="lane lane-todo" />
        <span className="lane lane-doing" />
        <span className="lane lane-done" />
        <span className="ticket" />
        <span className="ticket ticket-next" />
        <span className="sprint-card" />
        <span className="sprint-check" />
      </span>
    </span>
  );
}

function LearnerScene() {
  return (
    <span className="scene scene-learn" aria-hidden="true">
      <span className="book">
        <span className="leaf leaf-left" />
        <span className="leaf leaf-right" />
        <span className="leaf leaf-turn" />
      </span>
      <span className="spark" />
    </span>
  );
}
