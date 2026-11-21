import { z } from "zod";

import contactContent from "@/content/contact.json";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(contactContent.form.fields.name.minLength, contactContent.validation.nameRequired)
    .max(contactContent.form.fields.name.maxLength, contactContent.validation.nameTooLong),
  email: z
    .string()
    .trim()
    .email(contactContent.validation.emailInvalid)
    .max(contactContent.form.fields.email.maxLength, contactContent.validation.emailTooLong),
  organisation: z
    .string()
    .trim()
    .max(
      contactContent.form.fields.organisation.maxLength,
      contactContent.validation.organisationTooLong,
    )
    .optional()
    .default(""),
  message: z
    .string()
    .trim()
    .min(contactContent.form.fields.message.minLength, contactContent.validation.messageTooShort)
    .max(contactContent.form.fields.message.maxLength, contactContent.validation.messageTooLong),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Builds a mailto: link so the form works on static hosting without a server. */
export function buildMailto(to: string, data: ContactInput) {
  const subject = `${contactContent.mailto.subjectPrefix} ${data.name}${data.organisation ? ` (${data.organisation})` : ""}`;
  const body = `${data.message}\n\n${contactContent.mailto.signaturePrefix} ${data.name}\n${data.email}${data.organisation ? `\n${data.organisation}` : ""}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
