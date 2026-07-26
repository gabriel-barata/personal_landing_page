export interface ContactLink {
  id: string;
  label: string;
  href: string;
  kind: "email" | "linkedin" | "cv";
}

export const contactLinks: ContactLink[] = [
  {
    id: "email",
    label: "Email",
    href: "mailto:emanuel.barata.de@gmail.com",
    kind: "email",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/gabriel-barata/",
    kind: "linkedin",
  },
  {
    id: "cv",
    label: "Download CV",
    href: "/cv.pdf",
    kind: "cv",
  },
];

// The hero and footer contact rows repeat each other (visual-direction
// decision 6) but exclude the CV entry — the header already has its own
// standalone "Download CV" button (decision 13), so repeating it in the
// contact row would be a redundant second CTA.
export const contactRowLinks: ContactLink[] = contactLinks.filter(
  (link) => link.kind !== "cv",
);
