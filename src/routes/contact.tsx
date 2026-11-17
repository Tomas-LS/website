import { createFileRoute } from "@tanstack/react-router";
import { Linkedin, Mail, MapPin } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buildMailto, contactSchema } from "@/lib/contact";
import { site } from "@/content/site";

const description = `Contact ${site.name}, mechanical engineer in assistive technology — email, LinkedIn or contact form.`;

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${site.name}` },
      { name: "description", content: description },
      { property: "og:title", content: `Contact — ${site.name}` },
      { property: "og:description", content: description },
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
        eyebrow="Contact"
        title="Let's build something useful."
        lead="Whether you're hiring, collaborating on an assistive device or just want to talk engineering — I'd love to hear from you."
      />
      <section className="bg-surface-2 py-16 md:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
              { icon: Linkedin, label: "LinkedIn", value: site.linkedinLabel, href: site.linkedin },
              { icon: MapPin, label: "Based in", value: site.location },
            ].map((c) => {
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
                  {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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

          <form onSubmit={onSubmit} noValidate className="rounded-md border bg-card p-6 shadow-card md:p-10" aria-labelledby="form-heading">
            <h2 id="form-heading" className="text-2xl font-semibold">Send a message</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Submitting opens your email app with the message ready to send.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <Field id="name" label="Name" error={errors.name}>
                <Input id="name" name="name" autoComplete="name" maxLength={100} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
              </Field>
              <Field id="email" label="Email" error={errors.email}>
                <Input id="email" name="email" type="email" autoComplete="email" maxLength={255} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
              </Field>
              <Field id="organisation" label="Organisation (optional)" error={errors.organisation} className="sm:col-span-2">
                <Input id="organisation" name="organisation" autoComplete="organization" maxLength={120} />
              </Field>
              <Field id="message" label="Message" error={errors.message} className="sm:col-span-2">
                <Textarea id="message" name="message" rows={6} maxLength={2000} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} />
              </Field>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button type="submit" size="lg">Send message</Button>
              <p role="status" className="text-sm text-accent">
                {sent ? "Opening your email app…" : ""}
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

function Field({ id, label, error, className, children }: { id: string; label: string; error?: string | undefined; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-2 block">{label}</Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
