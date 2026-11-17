/**
 * Site-wide profile details. Edit these values to update your name,
 * contact links and short bio everywhere on the site.
 */
export const site = {
  name: "Alex Morgan",
  title: "Mechanical Engineer",
  specialization: "Assistive Technology & Accessibility Design",
  location: "Lyon, France",
  email: "alex.morgan@example.com",
  linkedin: "https://www.linkedin.com/in/your-profile",
  linkedinLabel: "linkedin.com/in/your-profile",
  tagline: "Engineering for a More Accessible World.",
  intro:
    "I design and build mechanical devices that help people with disabilities live, move and work more independently — from custom wheelchair adaptations to adaptive tools shaped around a single user's needs.",
} as const;

export const navItems = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills & Tools" },
  { to: "/contact", label: "Contact" },
] as const;
