import { describe, expect, it } from "vitest";

import { site } from "./site";
import profile from "./profile.json";

describe("site profile configuration", () => {
  it("uses the editable profile file for all profile fields", () => {
    expect(site).toMatchObject({
      name: profile.name,
      title: profile.title,
      specialization: profile.specialization,
      location: profile.location,
      email: profile.email,
      phone: profile.phone,
      linkedin: profile.linkedinUrl,
      linkedinLabel: profile.linkedinLabel,
    });
  });
});
