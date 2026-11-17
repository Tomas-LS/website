import { describe, expect, it } from "vitest";

import { buildMailto, contactSchema } from "./contact";

const valid = { name: "Jo", email: "jo@example.com", organisation: "", message: "Hello there, nice work!" };

describe("contact form", () => {
  it("accepts a complete message", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects messages over 2000 characters", () => {
    expect(contactSchema.safeParse({ ...valid, message: "a".repeat(2001) }).success).toBe(false);
  });

  it("encodes the message into the email link", () => {
    const url = buildMailto("me@example.com", { ...valid, message: "Hi & bye?" });
    expect(url.startsWith("mailto:me@example.com?subject=")).toBe(true);
    expect(url).toContain(encodeURIComponent("Hi & bye?"));
  });
});
