"use client";

import { useState } from "react";
import { useEditor, EditorContent, BubbleMenu, useEditorState, type Editor } from "@tiptap/react";
import { richTextExtensions } from "./richTextExtensions";
import type { RichTextBlock, TipTapNode } from "@/data/articles";

type HeadingItem = { pos: number; level: number; text: string; id: string };

function getHeadings(editor: Editor): HeadingItem[] {
  const items: HeadingItem[] = [];
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === "heading") {
      items.push({
        pos,
        level: node.attrs.level as number,
        text: node.textContent,
        id: (node.attrs.id as string) ?? "",
      });
    }
  });
  return items;
}

/** Positions shift as content above a heading changes, so this always
 *  re-resolves the node at `pos` fresh rather than trusting a stale
 *  capture — a mismatch is a safe no-op, not a wrong write. */
function setHeadingId(editor: Editor, pos: number, id: string) {
  editor
    .chain()
    .focus()
    .command(({ tr, state }) => {
      const node = state.doc.nodeAt(pos);
      if (!node || node.type.name !== "heading") return false;
      tr.setNodeAttribute(pos, "id", id || null);
      return true;
    })
    .run();
}

function toBlock(nodes: TipTapNode[]): RichTextBlock | null {
  return nodes.length > 0 ? { type: "richtext", content: { type: "doc", content: nodes } } : null;
}

const toolbarBtn =
  "flex h-7 min-w-7 items-center justify-center px-2 font-sans text-label text-muted transition-colors hover:bg-wash hover:text-ink";
const toolbarBtnActive = "bg-primary-strong text-white hover:bg-primary-strong hover:text-white";
const tiny =
  "font-sans text-micro uppercase tracking-caps text-muted transition-colors hover:text-primary";

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    // onMouseDown preventDefault keeps the text selection alive — a plain
    // click on a button outside the editor would otherwise collapse it
    // before onClick fires, leaving nothing for toggleBold/etc to act on.
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`${toolbarBtn} ${active ? toolbarBtnActive : ""}`}
    >
      {children}
    </button>
  );
}

export default function RichTextBlockField({
  block,
  onChange,
  onSplit,
}: {
  block: RichTextBlock;
  onChange: (next: RichTextBlock) => void;
  onSplit: (type: "table" | "faq", before: RichTextBlock | null, after: RichTextBlock | null) => void;
}) {
  const [linkEditing, setLinkEditing] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [linkRange, setLinkRange] = useState<{ from: number; to: number } | null>(null);

  const editor = useEditor({
    extensions: richTextExtensions,
    content: block.content,
    immediatelyRender: false,
    editorProps: { attributes: { class: "tiptap-editor" } },
    onUpdate: ({ editor }) =>
      onChange({ type: "richtext", content: editor.getJSON() as RichTextBlock["content"] }),
  });

  // editor is a mutable singleton — reading editor.isEmpty/state directly
  // in render would show stale values, since mutating it doesn't itself
  // trigger a React re-render. useEditorState is TipTap's hook for that.
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor ? { headings: getHeadings(editor), isEmpty: editor.isEmpty } : { headings: [], isEmpty: true },
  });

  if (!editor) return null;

  // Arrow expressions, not function declarations — TypeScript only carries
  // the `editor` non-null narrowing above into closures defined inline
  // like this, not into hoisted function declarations in the same scope.
  const applyLink = () => {
    const href = linkValue.trim();
    // Focus moving to this input can collapse the editor's own selection,
    // so the range captured when "Link" was clicked is restored explicitly
    // rather than trusting whatever editor.state.selection is by now.
    let chain = editor.chain().focus();
    if (linkRange) chain = chain.setTextSelection(linkRange);
    chain = chain.extendMarkRange("link");
    if (href) chain.setLink({ href }).run();
    else chain.unsetLink().run();
    setLinkEditing(false);
    setLinkRange(null);
  };

  const splitHere = (type: "table" | "faq") => {
    const boundary = editor.state.selection.$from.after(1);
    const before = (editor.state.doc.content.cut(0, boundary).toJSON() ?? []) as TipTapNode[];
    const after = (editor.state.doc.content.cut(boundary).toJSON() ?? []) as TipTapNode[];
    onSplit(type, toBlock(before), toBlock(after));
  };

  return (
    <div>
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor, state }) => {
          if (linkEditing) return true;
          const { from, to } = state.selection;
          return from !== to && editor.isEditable;
        }}
      >
        <div className="flex items-center gap-1 border border-hairline bg-paper p-1 shadow-panel">
          {linkEditing ? (
            <input
              autoFocus
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyLink();
                }
                if (e.key === "Escape") setLinkEditing(false);
              }}
              placeholder="/page, #anchor, or https://…"
              className="w-52 border-b border-hairline bg-transparent px-1 py-1 font-sans text-micro text-ink outline-none focus:border-primary"
            />
          ) : (
            <>
              <ToolbarButton
                label="Bold"
                active={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                <span className="font-bold">B</span>
              </ToolbarButton>
              <ToolbarButton
                label="Italic"
                active={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <span className="italic">I</span>
              </ToolbarButton>
              <ToolbarButton
                label="Heading 2"
                active={editor.isActive("heading", { level: 2 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              >
                H2
              </ToolbarButton>
              <ToolbarButton
                label="Heading 3"
                active={editor.isActive("heading", { level: 3 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              >
                H3
              </ToolbarButton>
              <ToolbarButton
                label="Bullet list"
                active={editor.isActive("bulletList")}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                •
              </ToolbarButton>
              <ToolbarButton
                label="Link"
                active={editor.isActive("link")}
                onClick={() => {
                  const { from, to } = editor.state.selection;
                  setLinkRange({ from, to });
                  setLinkValue((editor.getAttributes("link").href as string) ?? "");
                  setLinkEditing(true);
                }}
              >
                Link
              </ToolbarButton>
            </>
          )}
        </div>
      </BubbleMenu>

      <div className="relative">
        {editorState?.isEmpty && (
          <span className="pointer-events-none absolute left-4 top-4 font-sans text-copy text-muted/60">
            Start writing…
          </span>
        )}
        <EditorContent
          editor={editor}
          className="min-h-32 border border-hairline bg-paper p-4 outline-none"
        />
      </div>

      {editorState && editorState.headings.length > 0 && (
        <div className="mt-3 flex flex-col gap-2 border-t border-hairline pt-3">
          <span className="font-sans text-micro uppercase tracking-caps text-muted">Anchors</span>
          {editorState.headings.map((h) => (
            <label key={h.pos} className="flex flex-wrap items-center gap-2">
              <span className="min-w-0 flex-1 truncate font-sans text-micro text-text-secondary">
                H{h.level} — {h.text || "(empty)"}
              </span>
              <input
                defaultValue={h.id}
                onBlur={(e) => setHeadingId(editor, h.pos, e.target.value.trim().replace(/\s+/g, "-"))}
                placeholder="anchor-id"
                className="w-40 border-b border-hairline bg-transparent px-1 py-1 font-sans text-micro text-ink outline-none focus:border-primary"
              />
            </label>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-hairline pt-3">
        <span className="font-sans text-micro uppercase tracking-caps text-muted">
          Split here and insert
        </span>
        <button type="button" onClick={() => splitHere("table")} className={tiny}>
          + Table
        </button>
        <button type="button" onClick={() => splitHere("faq")} className={tiny}>
          + Questions &amp; answers
        </button>
      </div>
    </div>
  );
}
