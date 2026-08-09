"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Img from "@/components/ui/Img";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { formatIDR } from "@/lib/format";
import {
  TREATMENT_CATEGORIES,
  treatments,
  treatmentHref,
  type TreatmentCategoryId,
} from "@/data/treatments";

/**
 * SECTIONS 04 + 11 — TREATMENTS, ORGANISED BY CATEGORY
 *
 * The four categories are exactly the four on the live site, and every one
 * of its 27 treatments appears under one of them.
 *
 * A numbered editorial index rather than a card grid, for three reasons:
 * card grids force every treatment to identical visual weight and identical
 * description length (these run from one line to four); an index reads as a
 * considered menu; and it degrades honestly — eleven treatments in a grid is
 * a wall, eleven in an index is a list you scan.
 *
 * Hovering a row swaps the image in the sticky column. That column is
 * hidden below `lg` and marked `aria-hidden`, since every fact it shows is
 * already in the row beside it — the interaction is an enhancement, never
 * the only route to information.
 */
export default function Treatments() {
  const [active, setActive] = useState<TreatmentCategoryId>("facial-enhancement");
  const [hovered, setHovered] = useState<string | null>(null);

  const visible = treatments.filter((treatment) => treatment.category === active);
  const activeCategory = TREATMENT_CATEGORIES.find((c) => c.id === active);

  // Preview falls back through: hovered treatment's photo → first
  // treatment in the category → the category's own photo. Not every
  // treatment on the live site has an image, so this never renders empty.
  const hoveredTreatment = visible.find((t) => t.slug === hovered);
  const previewSrc =
    hoveredTreatment?.image ??
    visible.find((t) => t.image)?.image ??
    activeCategory?.image ??
    "/images/clinic/clinic-04.jpg";
  const previewLabel = hoveredTreatment?.name ?? activeCategory?.label ?? "";

  return (
    <section id="treatments" className="bg-background py-section">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            eyebrow="What We Do"
            title="Treatments"
            subtitle={`${treatments.length} treatments across facial enhancement, skin, body, and hair.`}
            className="lg:max-w-xl"
          />
          <Reveal delay={120} className="shrink-0">
            <Button href="/ubud-bali" variant="outline" size="sm" withArrow>
              View all treatments
            </Button>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div
            role="tablist"
            aria-label="Treatment categories"
            className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-b border-hairline"
          >
            {TREATMENT_CATEGORIES.map((category) => {
              const isActive = category.id === active;
              const count = treatments.filter((t) => t.category === category.id).length;
              return (
                <button
                  key={category.id}
                  role="tab"
                  type="button"
                  id={`tab-${category.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${category.id}`}
                  onClick={() => {
                    setActive(category.id);
                    setHovered(null);
                  }}
                  className={`relative -mb-px flex items-baseline gap-2 border-b-2 pb-4 font-sans text-[0.8125rem] uppercase tracking-[0.14em] transition-colors duration-300 ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted hover:text-text"
                  }`}
                >
                  {category.label}
                  <span className="font-sans text-[0.625rem] tabular-nums text-muted/70">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div
            role="tabpanel"
            id={`panel-${active}`}
            aria-labelledby={`tab-${active}`}
            className="lg:col-span-7"
          >
            <ul className="border-t border-hairline">
              {visible.map((treatment, index) => (
                <li key={treatment.slug} className="border-b border-hairline">
                  <Link
                    href={treatmentHref(treatment)}
                    onMouseEnter={() => setHovered(treatment.slug)}
                    onFocus={() => setHovered(treatment.slug)}
                    className="group flex gap-6 py-7 sm:gap-10"
                  >
                    <span className="pt-1.5 font-sans text-[0.75rem] tabular-nums tracking-widest text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1">
                      <h3 className="flex flex-wrap items-center gap-x-3 font-sans text-[length:var(--fs-h3)] leading-tight text-ink transition-colors duration-300 group-hover:text-primary">
                        {treatment.name}
                        <ArrowUpRightIcon className="h-4 w-4 shrink-0 -translate-x-2 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                      </h3>

                      <p className="mt-3 measure font-sans text-[0.9375rem] leading-relaxed text-text-secondary">
                        {treatment.shortDescription}
                      </p>

                      {treatment.startingPrice != null && (
                        <p className="mt-4 font-sans text-[0.75rem] uppercase tracking-[0.12em] text-muted">
                          From {formatIDR(treatment.startingPrice)}
                          {treatment.priceUnit ? ` ${treatment.priceUnit}` : ""}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:col-span-5 lg:block" aria-hidden="true">
            <div className="sticky top-32">
              <Img
                key={previewSrc}
                src={previewSrc}
                alt=""
                aspect="portrait"
                sizes="(max-width: 1024px) 0px, 40vw"
              />
              <p className="mt-5 font-sans text-[0.75rem] uppercase tracking-[0.14em] text-muted">
                {previewLabel}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
