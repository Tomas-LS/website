import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { vi } from "vitest";

vi.mock("@tanstack/react-router", async () => {
  const router =
    await vi.importActual<typeof import("@tanstack/react-router")>("@tanstack/react-router");
  const react = await vi.importActual<typeof import("react")>("react");

  return {
    ...router,
    Link: ({ to, children }: { to: string; children: ReactNode }) =>
      react.createElement("a", { href: to }, children),
  };
});

import { SiteFooter } from "@/components/site/SiteFooter";
import commonContent from "./common.json";
import homeContent from "./home.json";
import { HomePage } from "../routes";

describe("editable page copy", () => {
  it("renders the homepage introduction from home.json", () => {
    render(<HomePage />);

    expect(screen.getByText(homeContent.intro)).toBeInTheDocument();
  });

  it("renders the shared footer tagline from common.json", () => {
    render(<SiteFooter />);

    expect(screen.getByText(commonContent.footer.tagline)).toBeInTheDocument();
  });
});
