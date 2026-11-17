import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("site profile configuration", () => {
  it("uses neutral values when profile variables are blank", async () => {
    vi.stubEnv("VITE_PROFILE_NAME", "");
    vi.stubEnv("VITE_PROFILE_TITLE", "");
    vi.stubEnv("VITE_PROFILE_SPECIALIZATION", "");
    vi.stubEnv("VITE_PROFILE_LOCATION", "");
    vi.stubEnv("VITE_PROFILE_EMAIL", "");
    vi.stubEnv("VITE_PROFILE_PHONE", "");
    vi.stubEnv("VITE_PROFILE_LINKEDIN_URL", "");
    vi.stubEnv("VITE_PROFILE_LINKEDIN_LABEL", "");
    vi.stubEnv("VITE_PROFILE_TAGLINE", "");
    vi.stubEnv("VITE_PROFILE_INTRO", "");

    const { site } = await import("./site");

    expect(site).toMatchObject({
      name: "Your Name",
      title: "Your professional title",
      specialization: "Your specialization",
      location: "Location not configured",
      email: "name@example.com",
      phone: "",
      linkedin: "",
      linkedinLabel: "LinkedIn profile not configured",
      tagline: "Add your tagline here.",
      intro: "Add a short introduction here.",
    });
  });

  it("uses configured profile variables", async () => {
    vi.stubEnv("VITE_PROFILE_NAME", "Sample Name");
    vi.stubEnv("VITE_PROFILE_EMAIL", "sample@example.com");
    vi.stubEnv("VITE_PROFILE_PHONE", "+1 555 010 1234");
    vi.stubEnv("VITE_PROFILE_LINKEDIN_URL", "https://www.linkedin.com/in/sample");
    vi.stubEnv("VITE_PROFILE_LINKEDIN_LABEL", "linkedin.com/in/sample");

    const { site } = await import("./site");

    expect(site).toMatchObject({
      name: "Sample Name",
      email: "sample@example.com",
      phone: "+1 555 010 1234",
      linkedin: "https://www.linkedin.com/in/sample",
      linkedinLabel: "linkedin.com/in/sample",
    });
  });
});
