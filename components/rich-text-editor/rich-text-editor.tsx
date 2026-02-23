"use client";

import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import { Color, TextStyleKit } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bold,
  Check,
  Code,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  HighlighterIcon,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Paintbrush,
  Quote,
  Redo,
  Strikethrough,
  Table as TableIcon,
  Trash2,
  Underline as UnderlineIcon,
  Undo,
  Unlink,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./editor.module.css";

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

export function RichTextEditor({ value, onChange }: Readonly<Props>) {
  const [showImageForm, setShowImageForm] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageTitle, setImageTitle] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({ openOnClick: false }),
      Image.configure({
        inline: true,
        allowBase64: true,
        resize: {
          enabled: true,
          alwaysPreserveAspectRatio: true,
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyleKit,
      Color,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({
        placeholder: "Write your content here...",
      }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  const editorState = useEditorState({
    editor,
    selector: (ctx: any) => {
      return {
        color: ctx?.editor?.getAttributes("textStyle").color,
      };
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt, title: imageTitle }).run();
      setShowImageForm(false);
      setImageUrl("");
      setImageAlt("");
      setImageTitle("");
    }
  };

  const btn = (active = false) =>
    `inline-flex items-center justify-center h-9 w-9 rounded-md border
     ${active ? "bg-gray-200 text-black" : "bg-white text-gray-600"}
     hover:bg-gray-100 transition`;

  return (
    <div className={styles.editor + " border rounded-lg overflow-hidden bg-white"}>
      {/* Toolbar */}
      <div className="bg-gray-50 p-2 border-b divide-y divide-gray-200">
        <div className="flex flex-wrap gap-1 pb-2">
          {/* ... existing buttons ... */}
          <button
            className={btn(editor.isActive("bold"))}
            onClick={() => editor.chain().focus().toggleBold().run()}
            type="button"
            title="Bold"
          >
            <Bold size={16} />
          </button>

          <button
            className={btn(editor.isActive("italic"))}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            type="button"
            title="Italic"
          >
            <Italic size={16} />
          </button>

          <button
            className={btn(editor.isActive("underline"))}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            type="button"
            title="Underline"
          >
            <UnderlineIcon size={16} />
          </button>

          <button
            className={btn(editor.isActive("strike"))}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            type="button"
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </button>

          <div className="bg-gray-300 mx-1 w-px" />

          {/* Headings */}
          <button
            className={btn(editor.isActive("heading", { level: 1 }))}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            type="button"
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>

          <button
            className={btn(editor.isActive("heading", { level: 2 }))}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            type="button"
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>

          <button
            className={btn(editor.isActive("heading", { level: 3 }))}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            type="button"
            title="Heading 3"
          >
            <Heading3 size={16} />
          </button>
          <button
            className={btn(editor.isActive("heading", { level: 4 }))}
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            type="button"
            title="Heading 4"
          >
            <Heading4 size={16} />
          </button>
          <button
            className={btn(editor.isActive("heading", { level: 5 }))}
            onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
            type="button"
            title="Heading 5"
          >
            <Heading5 size={16} />
          </button>
          <button
            className={btn(editor.isActive("heading", { level: 6 }))}
            onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
            type="button"
            title="Heading 6"
          >
            <Heading6 size={16} />
          </button>

          <div className="bg-gray-300 mx-1 w-px" />
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={btn(editor.isActive("highlight", { level: 3 }))}
            type="button"
            title="Highlight"
          >
            <HighlighterIcon size={16} />
          </button>
          <button type="button" className={btn()} title="Text color">
            <label className="flex justify-center items-center cursor-pointer">
              <Paintbrush size={16} />
              <input
                type="color"
                onInput={(event) =>
                  editor.chain().focus().setColor(event.currentTarget.value).run()
                }
                value={editorState?.color || ""}
                data-testid="setColor"
                className="absolute opacity-0 w-0 h-0"
              />
            </label>
          </button>

          <button
            type="button"
            className={btn()}
            onClick={() => editor.chain().focus().unsetColor().run()}
            title="Remove color"
          >
            ✕
          </button>
          <div className="bg-gray-300 mx-1 w-px" />
          <button
            type="button"
            className={btn(editor.isActive({ textAlign: "left" }))}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>

          <button
            type="button"
            className={btn(editor.isActive({ textAlign: "center" }))}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>

          <button
            type="button"
            className={btn(editor.isActive({ textAlign: "right" }))}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>

          <button
            type="button"
            className={btn(editor.isActive({ textAlign: "justify" }))}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            title="Align Justify"
          >
            <AlignJustify size={16} />
          </button>
          <div className="bg-gray-300 mx-1 w-px" />

          <button
            className={btn(editor.isActive("bulletList"))}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            type="button"
            title="Bullet List"
          >
            <List size={16} />
          </button>

          <button
            className={btn(editor.isActive("orderedList"))}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            type="button"
            title="Ordered List"
          >
            <ListOrdered size={16} />
          </button>

          <button
            className={btn(editor.isActive("blockquote"))}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            type="button"
            title="Blockquote"
          >
            <Quote size={16} />
          </button>

          <button
            className={btn(editor.isActive("codeBlock"))}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            type="button"
            title="Code Block"
          >
            <Code size={16} />
          </button>

          <button
            className={btn(editor.isActive("table"))}
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
            type="button"
            title="Insert Table"
          >
            <TableIcon size={16} />
          </button>

          {editor.isActive("table") && (
            <button
              className={btn()}
              onClick={() => editor.chain().focus().deleteTable().run()}
              type="button"
              title="Delete Table"
            >
              <Trash2 size={16} className="font-bold text-red-600" />
            </button>
          )}

          <div className="bg-gray-300 mx-1 w-px" />

          <button
            className={btn(editor.isActive("link"))}
            type="button"
            onClick={() => {
              const url = prompt("Enter URL");
              if (url) {
                editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
              }
            }}
            title="Insert Link"
          >
            <LinkIcon size={16} />
          </button>

          <button
            className={btn()}
            onClick={() => editor.chain().focus().unsetLink().run()}
            type="button"
            title="Remove Link"
          >
            <Unlink size={16} />
          </button>

          <button
            className={btn(showImageForm || editor.isActive("image"))}
            type="button"
            onClick={() => setShowImageForm(!showImageForm)}
            title="Insert Image"
          >
            <ImageIcon size={16} />
          </button>

          <button
            className={btn()}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            type="button"
            title="Horizontal Rule"
          >
            <Minus size={16} />
          </button>

          <div className="bg-gray-300 mx-1 w-px" />

          <button
            className={btn()}
            onClick={() => editor.chain().focus().undo().run()}
            type="button"
            title="Undo"
          >
            <Undo size={16} />
          </button>

          <button
            className={btn()}
            onClick={() => editor.chain().focus().redo().run()}
            type="button"
            title="Redo"
          >
            <Redo size={16} />
          </button>

          <button
            className={btn()}
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            type="button"
            title="Clear Formatting"
          >
            <Eraser size={16} />
          </button>
        </div>

        {editor.isActive("table") && (
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* Column Actions */}
            <div className="flex items-center gap-1 bg-gray-50 p-1 border rounded-md">
              <span className="px-1 text-gray-500 text-xs">Columns</span>

              <button
                className={btn()}
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                type="button"
                title="Add Column Before"
              >
                <ArrowLeft size={16} />
              </button>

              <button
                className={btn()}
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                type="button"
                title="Add Column After"
              >
                <ArrowRight size={16} />
              </button>

              <button
                className={btn()}
                onClick={() => editor.chain().focus().deleteColumn().run()}
                type="button"
                title="Delete Column"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>

            {/* Row Actions */}
            <div className="flex items-center gap-1 bg-gray-50 p-1 border rounded-md">
              <span className="px-1 text-gray-500 text-xs">Rows</span>

              <button
                className={btn()}
                onClick={() => editor.chain().focus().addRowBefore().run()}
                type="button"
                title="Add Row Before"
              >
                <ArrowUp size={16} />
              </button>

              <button
                className={btn()}
                onClick={() => editor.chain().focus().addRowAfter().run()}
                type="button"
                title="Add Row After"
              >
                <ArrowDown size={16} />
              </button>

              <button
                className={btn()}
                onClick={() => editor.chain().focus().deleteRow().run()}
                type="button"
                title="Delete Row"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
          </div>
        )}

        {showImageForm && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="px-2 py-1 text-sm border rounded hover:border-gray-400 focus:outline-none focus:border-blue-500 w-64"
            />
            <input
              type="text"
              placeholder="Alt Text (optional)"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              className="px-2 py-1 text-sm border rounded hover:border-gray-400 focus:outline-none focus:border-blue-500 w-40"
            />
            <input
              type="text"
              placeholder="Title (optional)"
              value={imageTitle}
              onChange={(e) => setImageTitle(e.target.value)}
              className="px-2 py-1 text-sm border rounded hover:border-gray-400 focus:outline-none focus:border-blue-500 w-40"
            />
            <button
              className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
              onClick={() => addImage()}
              type="button"
              title="Add Image"
            >
              <Check size={16} />
            </button>
            <button
              className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              onClick={() => setShowImageForm(false)}
              type="button"
              title="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="p-4 focus:outline-none max-w-none prose" />
    </div>
  );
}
