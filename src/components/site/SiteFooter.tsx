import { Link } from "@tanstack/react-router";
import { Linkedin, Mail } from "lucide-react";

import { navItems, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t bg-inverse text-inverse-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-semibold">{site.name}</p>
          <p className="mt-1 text-sm text-inverse-muted">
            {site.title} · {site.specialization}
          </p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-inverse-muted">{site.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow text-inverse-muted">Pages</p>
          <ul className="mt-4 space-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow text-inverse-muted">Contact</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-accent">
                <Mail className="size-4" aria-hidden /> {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-accent"
              >
                <Linkedin className="size-4" aria-hidden /> LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-inverse-border">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-inverse-muted md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="font-mono">{site.location}</p>
        </div>
      </div>
    </footer>
  );
}
