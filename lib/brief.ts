/** The 10 brief questions. Edit freely: they are shown to the client and to the admin. */
export const briefQuestions: { id: string; label: string; hint?: string; type?: "text" | "textarea" | "select"; options?: string[]; required?: boolean }[] = [
  { id: "company", label: "Business name", hint: "Exactly as it should appear on your logo.", required: true },
  { id: "activity", label: "What does your business do?", hint: "One or two sentences.", type: "textarea", required: true },
  { id: "audience", label: "Who are your customers?", hint: "Age, profession, location, what they care about…", type: "textarea", required: true },
  { id: "words", label: "3 words that describe your brand", hint: "e.g. trustworthy, modern, warm", required: true },
  { id: "colors_like", label: "Colors you like", hint: "Leave empty if you have no preference." },
  { id: "colors_avoid", label: "Colors to avoid" },
  { id: "references", label: "Logos or brands you admire", hint: "Names or links. Tell us what you like about them.", type: "textarea" },
  {
    id: "style",
    label: "Which style feels right?",
    type: "select",
    options: ["Modern & minimal", "Classic & elegant", "Bold & playful", "Luxury & premium", "Technical & precise", "Not sure — surprise me"],
    required: true,
  },
  { id: "usage", label: "Where will your logo be used?", hint: "Website, packaging, signage, social media, uniforms…" },
  { id: "notes", label: "Anything else we should know?", hint: "Slogan, symbol ideas, things you definitely don’t want…", type: "textarea" },
];
