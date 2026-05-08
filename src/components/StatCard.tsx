import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  delta?: number;
  hint?: string;
  icon?: ReactNode;
  variant?: "default" | "primary" | "navy";
}

export function StatCard({ label, value, unit, delta, hint, icon, variant = "default" }: StatCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg border p-5 shadow-card transition-all hover:shadow-elevated",
      variant === "default" && "bg-card border-border",
      variant === "primary" && "bg-gradient-primary text-primary-foreground border-transparent",
      variant === "navy" && "bg-gradient-navy text-navy-foreground border-transparent",
    )}>
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium opacity-70">{label}</div>
        {icon && <div className="opacity-60">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tabular-nums tracking-tight">{value}</span>
        {unit && <span className="text-xs opacity-70">{unit}</span>}
      </div>
      <div className="mt-2 flex items-center gap-2 text-[11px]">
        {delta !== undefined && (
          <span className={cn("inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm font-medium",
            delta >= 0 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
          )}>
            {delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
        {hint && <span className="opacity-60">{hint}</span>}
      </div>
    </div>
  );
}
