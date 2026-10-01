import { useContext, type ReactNode } from "react";
import { handleRouteClick, isPagePath, NavigateContext } from "../routing";

// Renders a link edited in Sanity: a site page ("/packages"), a section anchor ("#paket"),
// or an external/tel:/mailto: link.
export function CmsLink({ href, className, children, onClick }: { href: string; className?: string; children: ReactNode; onClick?: () => void }) {
  const navigate = useContext(NavigateContext);
  const path = href.replace(/\/$/, "") || "/";

  if (isPagePath(path)) {
    return <a href={path} onClick={(e) => { onClick?.(); handleRouteClick(e, path, navigate); }} className={className}>{children}</a>;
  }
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} onClick={onClick} className={className} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
      {children}
    </a>
  );
}
