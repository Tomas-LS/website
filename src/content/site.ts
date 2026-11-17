const profileValue = (value: string | undefined, fallback: string) => value?.trim() || fallback;
const optionalProfileValue = (value: string | undefined) => value?.trim() || "";

const linkedin = optionalProfileValue(import.meta.env.VITE_PROFILE_LINKEDIN_URL);

export const site = {
  name: profileValue(import.meta.env.VITE_PROFILE_NAME, "Your Name"),
  title: profileValue(import.meta.env.VITE_PROFILE_TITLE, "Your professional title"),
  specialization: profileValue(import.meta.env.VITE_PROFILE_SPECIALIZATION, "Your specialization"),
  location: profileValue(import.meta.env.VITE_PROFILE_LOCATION, "Location not configured"),
  email: profileValue(import.meta.env.VITE_PROFILE_EMAIL, "name@example.com"),
  phone: optionalProfileValue(import.meta.env.VITE_PROFILE_PHONE),
  linkedin,
  linkedinLabel: profileValue(
    import.meta.env.VITE_PROFILE_LINKEDIN_LABEL,
    linkedin || "LinkedIn profile not configured",
  ),
  tagline: profileValue(import.meta.env.VITE_PROFILE_TAGLINE, "Add your tagline here."),
  intro: profileValue(import.meta.env.VITE_PROFILE_INTRO, "Add a short introduction here."),
} as const;

export const navItems = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills & Tools" },
  { to: "/contact", label: "Contact" },
] as const;
