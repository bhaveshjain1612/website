type LiftedTitleProps = {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export function LiftedTitle({ text, as = "h3", className }: LiftedTitleProps) {
  const Tag = as;
  const mergedClassName = [className, "lifted-title-script"].filter(Boolean).join(" ");

  return (
    <Tag className={mergedClassName}>{text}</Tag>
  );
}
