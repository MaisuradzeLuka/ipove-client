type LogoSize = "sm" | "md" | "lg";

const sizeClasses: Record<
  LogoSize,
  { text: string; dot: string; dotOffset: string }
> = {
  sm: { text: "text-xl", dot: "size-2", dotOffset: "-top-0.5" },
  md: { text: "text-2xl", dot: "size-2.5", dotOffset: "-top-1" },
  lg: { text: "text-3xl", dot: "size-2.5", dotOffset: "-top-1" },
};

type LogoProps = {
  size?: LogoSize;
  className?: string;
};

/** Ipove wordmark — accent periwinkle dot on “I” */
export function Logo({ size = "md", className = "" }: LogoProps) {
  const s = sizeClasses[size];

  return (
    <span
      className={`inline-flex font-semibold tracking-tight text-foreground ${s.text} ${className}`}
      aria-label="Ipove">
      <span className="relative inline-block pr-0.5">
        <span aria-hidden="true">I</span>
        <span
          className={`absolute left-1/2 ${s.dotOffset} ${s.dot} -translate-x-1/2 rounded-full bg-accent`}
          aria-hidden
        />
      </span>
      <span aria-hidden="true">pove</span>
    </span>
  );
}
