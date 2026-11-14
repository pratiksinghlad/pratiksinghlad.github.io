export const NAME = "Pratik Singh Lad";
export const ROLE = "Software engineer";
export const LOCATION = "Coventry, UK";
export const PHOTO_PATH = "images/profile-144.jpg";
export const PHOTO_LARGE_PATH = "images/profile_picture_icon.jpg";
export const EMAIL = "pratiklad9625@gmail.com";
export const GITHUB_URL = "https://github.com/pratiksinghlad";
export const LINKEDIN_URL = "https://www.linkedin.com/in/pratiksinghlad";
export const CONTACT_LABEL = "Hire/contact me";
export const LINKEDIN_LABEL = "LinkedIn";
export const GITHUB_LABEL = "GitHub";

export const TECH_STACK = [
  { id: "ai-llm", label: "AI/LLM", mark: "#6D5EF5" },
  { id: "ai-agents", label: "AI Agents", mark: "#243552" },
  { id: "typescript", label: "TypeScript", mark: "#3178C6" },
  { id: "python", label: "Python", mark: "#3776AB" },
  { id: "dotnet", label: ".NET / C#", mark: "#512BD4" },
  { id: "react", label: "React", mark: "#149ECA" },
  { id: "nodejs", label: "Node.js", mark: "#339933" },
  { id: "postgresql", label: "PostgreSQL", mark: "#336791" },
  { id: "sql-server", label: "SQL Server", mark: "#CC2927" },
  { id: "mongodb", label: "MongoDB", mark: "#47A248" },
  { id: "azure", label: "Azure", mark: "#0078D4" },
  { id: "aws", label: "AWS", mark: "#E47911" },
  { id: "docker", label: "Docker", mark: "#2496ED" },
  { id: "k8", label: "K8", mark: "#326CE5" },
  { id: "cicd", label: "CI/CD", mark: "#243552" },
] as const;

export type TechItem = (typeof TECH_STACK)[number];
export type TechId = TechItem["id"];

const ALL_TECH_IDS: readonly TechId[] = TECH_STACK.map((item) => item.id);

export interface Principle {
  readonly id: string;
  readonly label: string;
  readonly line: string;
  readonly techIds: readonly TechId[];
}

export const PRINCIPLES: readonly Principle[] = [
  {
    id: "ai-native",
    label: "AI-Native",
    line: "Models in the work",
    techIds: ["ai-llm", "ai-agents", "typescript", "python"],
  },
  {
    id: "builder",
    label: "Builder",
    line: "Ships software",
    techIds: ["react", "typescript", "nodejs", "dotnet"],
  },
  {
    id: "problem-solver",
    label: "Problem Solver",
    line: "Finds the constraint",
    techIds: [
      "ai-llm",
      "ai-agents",
      "python",
      "dotnet",
      "nodejs",
      "postgresql",
      "sql-server",
      "mongodb",
      "azure",
      "aws",
    ],
  },
  {
    id: "critical-thinking",
    label: "Critical Thinking",
    line: "Weighs the options",
    techIds: ["ai-llm", "ai-agents", "python", "postgresql", "sql-server"],
  },
  {
    id: "agile",
    label: "Agile",
    line: "Small steps, fast feedback",
    techIds: ["cicd", "docker", "k8"],
  },
  {
    id: "learner",
    label: "Continuous Learner",
    line: "Keeps learning the craft",
    techIds: ALL_TECH_IDS,
  },
];

const CONTACT_SUBJECT = "Hello";

export interface Spotlight {
  readonly kind: "principle" | "tech";
  readonly id: string;
}

export function contactHref(): string {
  const subject = encodeURIComponent(CONTACT_SUBJECT);
  return `mailto:${EMAIL}?subject=${subject}`;
}

export function photoUrl(): string {
  return `${import.meta.env.BASE_URL}${PHOTO_PATH}`;
}

export function photoLargeUrl(): string {
  return `${import.meta.env.BASE_URL}${PHOTO_LARGE_PATH}`;
}

export function techIdsFor(principleId: string | null): ReadonlySet<TechId> | null {
  if (principleId === null) return null;
  const principle = PRINCIPLES.find((item) => item.id === principleId);
  if (!principle) return null;
  return new Set(principle.techIds);
}

export function litTechIds(active: Spotlight | null): ReadonlySet<TechId> | null {
  if (!active) return null;
  if (active.kind === "tech") return techSet(asTechId(active.id));
  return techIdsFor(active.id);
}

export function principleIdsForTech(techId: string): ReadonlySet<string> {
  const id = asTechId(techId);
  if (!id) return new Set();
  const matches = PRINCIPLES.filter((item) => item.techIds.includes(id));
  return new Set(matches.map((item) => item.id));
}

function techSet(id: TechId | null): ReadonlySet<TechId> | null {
  if (!id) return null;
  return new Set([id]);
}

function asTechId(id: string): TechId | null {
  const found = TECH_STACK.find((item) => item.id === id);
  return found ? found.id : null;
}
