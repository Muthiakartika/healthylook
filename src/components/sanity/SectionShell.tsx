import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import type { SectionTone } from "@/sanity/types";

const toneClasses: Record<SectionTone, string> = {
  paper: "bg-paper",
  white: "bg-white",
  wash: "bg-wash",
  blush: "bg-blush",
  lime: "bg-section",
  brown: "bg-ink-brown text-white",
};

export default function SectionShell({
  children,
  tone = "paper",
  anchor,
  className = "",
}: {
  children: ReactNode;
  tone?: SectionTone;
  anchor?: string;
  className?: string;
}) {
  return (
    <section id={anchor} className={`scroll-mt-24 py-section ${toneClasses[tone]} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
