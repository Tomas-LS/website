import { createFileRoute } from "@tanstack/react-router";
import { Linkedin, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import contactContent from "@/content/contact.json";
import { buildMailto, contactSchema } from "@/lib/contact";
import { site } from "@/content/site";

type ContactDetail = { icon: LucideIcon; label: string; value: string; href?: string };

function getContactDetail(key: string, label: string): ContactDetail {
  switch (key) {
    case "email":
      return { icon: Mail, label, value: site.email, href: `mailto:${site.email}` };
    case "phone":
      return site.phone
        ? {
            icon: Phone,
            label,
            value: site.phone,
            href: `tel:${site.phone.replace(/[^\d+]/g, "")}`,
          }
        : { icon: Phone, label, value: contactContent.notConfigured };
    case "linkedin":
      return { icon: Linkedin, label, value: site.linkedinLabel, href: site.linkedin };
    case "location":
      return { icon: MapPin, label, value: site.location };
    default:
      throw new Error(`Unknown contact detail "${key}".`);
  }
}

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: contactContent.meta.title.replace("{name}", site.name) },
      {
        name: "description",
        content: contactContent.meta.description.replace("{name}", site.name),
      },
      { property: "og:title", content: contactContent.meta.title.replace("{name}", site.name) },
      {
        property: "og:description",
        content: contactContent.meta.description.replace("{name}", site.name),
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

type Errors = Partial<Record<"name" | "email" | "organisation" | "message", string>>;

function ContactPage() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const result = contactSchema.safeParse(Object.fromEntries(form));
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof Errors;
        next[key] ??= issue.message;
      }
      setErrors(next);
      setSent(false);
      return;
    }
    setErrors({});
    setSent(true);
    window.location.href = buildMailto(site.email, result.data);
  }

  return (
    <>
      <PageHeader
        eyebrow={contactContent.heading.eyebrow}
        title={contactContent.heading.title}
        lead={contactContent.heading.lead}
      />
      <section className="bg-surface-2 py-16 md:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="space-y-4">
            {contactContent.details.map((content) => {
              const c = getContactDetail(content.key, content.label);
              const inner = (
                <>
                  <c.icon className="size-5 text-accent" aria-hidden />
                  <span>
                    <span className="eyebrow block text-muted-foreground">{c.label}</span>
                    <span className="mt-1 block font-medium break-all">{c.value}</span>
                  </span>
                </>
              );
              return c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  {...(c.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="flex items-start gap-4 rounded-md border bg-card p-6 shadow-card transition-colors hover:border-accent"
                >
                  {inner}
                </a>
              ) : (
                <div key={c.label} className="flex items-start gap-4 rounded-md border bg-card p-6">
                  {inner}
                </div>
              );
            })}
          </div>

          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-md border bg-card p-6 shadow-card md:p-10"
            aria-labelledby="form-heading"
          >
            <h2 id="form-heading" className="text-2xl font-semibold">
              {contactContent.form.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{contactContent.form.description}</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <Field id="name" label={contactContent.form.fields.name.label} error={errors.name}>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  maxLength={contactContent.form.fields.name.maxLength}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
              </Field>
              <Field id="email" label={contactContent.form.fields.email.label} error={errors.email}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={contactContent.form.fields.email.maxLength}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </Field>
              <Field
                id="organisation"
                label={contactContent.form.fields.organisation.label}
                error={errors.organisation}
                className="sm:col-span-2"
              >
                <Input
                  id="organisation"
                  name="organisation"
                  autoComplete="organization"
                  maxLength={contactContent.form.fields.organisation.maxLength}
                />
              </Field>
              <Field
                id="message"
                label={contactContent.form.fields.message.label}
                error={errors.message}
                className="sm:col-span-2"
              >
                <Textarea
                  id="message"
                  name="message"
                  rows={contactContent.form.fields.message.rows}
                  maxLength={contactContent.form.fields.message.maxLength}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
              </Field>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button type="submit" size="lg">
                {contactContent.form.submitButton}
              </Button>
              <p role="status" className="text-sm text-accent">
                {sent ? contactContent.form.openingEmailStatus : ""}
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-2 block">
        {label}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
