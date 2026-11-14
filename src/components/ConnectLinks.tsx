import { GITHUB_LABEL, GITHUB_URL, LINKEDIN_LABEL, LINKEDIN_URL } from "../data/portfolio";
import { GitHubIcon, LinkedInIcon } from "./icons";

export function ConnectLinks() {
  return (
    <div className="connect">
      <a className="action" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
        <GitHubIcon />
        {GITHUB_LABEL}
      </a>
      <a className="action" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
        <LinkedInIcon />
        {LINKEDIN_LABEL}
      </a>
    </div>
  );
}
