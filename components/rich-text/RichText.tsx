import styles from "./RichText.module.css";

interface RichTextProps {
  content: string;
  className?: string;
}

export default function RichText({ content, className }: RichTextProps) {
  return (
    <div
      className={`${styles.richText} ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
