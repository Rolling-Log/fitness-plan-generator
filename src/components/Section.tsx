import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  description?: string;
  level?: "glass-level-1" | "glass-level-2";
  children: ReactNode;
}

export default function Section({ title, description, level = "glass-level-1", children }: SectionProps): JSX.Element {
  return (
    <section className={`panel ${level} p-5 sm:p-6`}>
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-[#1d1d1f]">{title}</h2>
        {description ? <p className="mt-1 text-sm text-[#666666]">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}
