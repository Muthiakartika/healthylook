import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";

/**
 * Adds an optional `id` attribute to headings, purely for anchor links —
 * unrelated to any ProseMirror-internal node id. `...this.parent?.()` is
 * required: it's how `.extend()` merges with the base extension's own
 * attributes (here, `level`) rather than replacing them.
 */
export const HeadingWithId = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("id"),
        renderHTML: (attributes: Record<string, unknown>) =>
          attributes.id ? { id: attributes.id as string } : {},
      },
    };
  },
});

/** A relative path or an in-page anchor is a normal, expected link target
 *  on this site — not a suspicious one — so both are explicitly allowed
 *  alongside http(s), rather than only trusting the extension's default. */
function hrefIsAllowed(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith("/") || href.startsWith("#");
}

/**
 * The default Link extension puts `target="_blank" rel="noopener noreferrer
 * nofollow"` on every link, external or not — right for a link off-site,
 * wrong for one of this site's own pages or an in-page anchor: opening our
 * own anchor in a new tab makes no sense, and `nofollow` on our own
 * content actively hurts this page's internal linking for SEO. Overriding
 * renderHTML keeps the same XSS guard the default has (stripping a href
 * that fails validation) but only external links get target/rel.
 */
export const RichLink = Link.extend({
  renderHTML({ HTMLAttributes }) {
    const href = String(HTMLAttributes.href ?? "");
    if (!hrefIsAllowed(href)) {
      return ["a", { ...HTMLAttributes, href: "" }, 0];
    }
    const external = /^https?:\/\//i.test(href);
    return [
      "a",
      external
        ? { ...HTMLAttributes, target: "_blank", rel: "noopener noreferrer" }
        : { ...HTMLAttributes, target: null, rel: null },
      0,
    ];
  },
}).configure({
  openOnClick: false,
  autolink: false,
  protocols: ["http", "https", "mailto", "tel"],
  validate: hrefIsAllowed,
  isAllowedUri: hrefIsAllowed,
});

export const richTextExtensions = [
  StarterKit.configure({
    heading: false,
    orderedList: false,
    blockquote: false,
    codeBlock: false,
    code: false,
    strike: false,
    horizontalRule: false,
  }),
  HeadingWithId.configure({ levels: [2, 3] }),
  RichLink,
];
