import profile from "./profile.json";
import commonContent from "./common.json";

const profileValue = (value: string, fallback: string) => value.trim() || fallback;
const linkedin = profile.linkedinUrl.trim();

export const site = {
  name: profileValue(profile.name, "Your Name"),
  title: profileValue(profile.title, "Mechanical Engineer"),
  specialization: profileValue(
    profile.specialization,
    "Assistive Technology & Accessibility Design",
  ),
  location: profileValue(profile.location, "Location not configured"),
  email: profileValue(profile.email, "name@example.com"),
  phone: profile.phone.trim(),
  linkedin,
  linkedinLabel: profileValue(profile.linkedinLabel, linkedin || "LinkedIn profile not configured"),
} as const;

export const navItems = [
  { to: "/", label: commonContent.navigation.home },
  { to: "/projects", label: commonContent.navigation.projects },
  { to: "/about", label: commonContent.navigation.about },
  { to: "/skills", label: commonContent.navigation.skills },
  { to: "/contact", label: commonContent.navigation.contact },
] as const;

export const common = commonContent;
