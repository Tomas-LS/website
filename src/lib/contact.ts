import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be under 255 characters"),
  organisation: z.string().trim().max(120, "Organisation must be under 120 characters").optional().default(""),
  message: z
    .string()
    .trim()
    .min(10, "Message should be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Builds a mailto: link so the form works on static hosting without a server. */
export function buildMailto(to: string, data: ContactInput) {
  const subject = `Portfolio enquiry from ${data.name}${data.organisation ? ` (${data.organisation})` : ""}`;
  const body = `${data.message}\n\n— ${data.name}\n${data.email}${data.organisation ? `\n${data.organisation}` : ""}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
