import { cn } from "@/lib/utils";

interface KNMarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

/** Brand monogram. */
export function KNMark({ className, size = "md" }: KNMarkProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-md border border-primary/20 bg-primary text-primary-foreground font-bold tracking-tight",
        sizes[size],
        className,
      )}
      aria-hidden
    >
      KN
    </span>
  );
}
