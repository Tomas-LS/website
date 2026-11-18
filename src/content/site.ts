import profile from "./profile.json";

const profileValue = (value: string, fallback: string) => value.trim() || fallback;
const linkedin = profile.linkedinUrl.trim();

export const site = {
  name: profileValue(profile.name, "Your Name"),
  title: profileValue(profile.title, "Mechanical Engineer"),
  specialization: profileValue(profile.specialization, "Assistive Technology & Accessibility Design"),
  location: profileValue(profile.location, "Location not configured"),
  email: profileValue(profile.email, "name@example.com"),
  phone: profile.phone.trim(),
  linkedin,
  linkedinLabel: profileValue(profile.linkedinLabel, linkedin || "LinkedIn profile not configured"),
  tagline: "Add your tagline here.",
  intro: "Add a short introduction here.",
} as const;

export const navItems = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills & Tools" },
  { to: "/contact", label: "Contact" },
] as const;
