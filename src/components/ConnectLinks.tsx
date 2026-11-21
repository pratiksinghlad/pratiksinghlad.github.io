import type { ReactNode } from "react";
import { GITHUB_LABEL, GITHUB_URL, LINKEDIN_LABEL, LINKEDIN_URL } from "../data/portfolio";
import { GitHubIcon, LinkedInIcon } from "./icons";

const NEW_TAB_LABEL = "opens in a new tab";

export function ConnectLinks() {
  return (
    <>
      <ExternalLink href={GITHUB_URL} label={GITHUB_LABEL} icon={<GitHubIcon />} />
      <ExternalLink href={LINKEDIN_URL} label={LINKEDIN_LABEL} icon={<LinkedInIcon />} />
    </>
  );
}

function ExternalLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <a className="action glass" href={href} target="_blank" rel="noopener noreferrer me">
      {icon}
      {label}
      <span className="visually-hidden"> ({NEW_TAB_LABEL})</span>
    </a>
  );
}
