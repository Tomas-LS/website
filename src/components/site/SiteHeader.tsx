import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { navItems, site } from "@/content/site";
import { cn } from "@/lib/utils";

export function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label={`${site.name} — home`}>
      <span
        aria-hidden
        className="grid size-9 place-items-center rounded-sm bg-primary font-display text-sm font-bold text-primary-foreground transition-colors group-hover:bg-accent"
      >
        {site.name
          .split(" ")
          .map((p) => p[0])
          .join("")}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-[0.95rem] font-semibold">{site.name}</span>
        <span className="eyebrow text-[0.6rem] text-muted-foreground">{site.title}</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Logo />

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="relative rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:after:absolute data-[status=active]:after:inset-x-3 data-[status=active]:after:-bottom-[1px] data-[status=active]:after:h-0.5 data-[status=active]:after:bg-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-sm border md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={cn("border-t bg-background md:hidden", open ? "block" : "hidden")}
      >
        <ul className="container-page flex flex-col py-3">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b py-3.5 font-display text-lg last:border-0 data-[status=active]:text-accent"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
