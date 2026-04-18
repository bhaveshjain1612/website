import { splitFirstWord } from "@/lib/site-data";

type LiftedTitleProps = {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export function LiftedTitle({ text, as = "h3", className }: LiftedTitleProps) {
  const { first, rest } = splitFirstWord(text);
  const Tag = as;

  if (first.length <= 3) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      <span className="script-lift">{first}</span>
      {rest ? ` ${rest}` : ""}
    </Tag>
  );
}
