import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ControlStatus } from "@/data/cisControls";

const statusConfig: Record<ControlStatus, { label: string; className: string }> = {
  compliant: { label: "Compliant", className: "bg-success/10 text-success border-success/20 hover:bg-success/20" },
  "non-compliant": { label: "Non-Compliant", className: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20" },
  "in-progress": { label: "In Progress", className: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20" },
};

export function StatusBadge({ status }: { status: ControlStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}

export function RiskLevelBadge({ level }: { level: string }) {
  const config: Record<string, string> = {
    Low: "bg-success/10 text-success border-success/20",
    Medium: "bg-warning/10 text-warning border-warning/20",
    High: "bg-destructive/10 text-destructive border-destructive/20",
    Critical: "bg-destructive/20 text-destructive border-destructive/30 font-bold",
  };
  return (
    <Badge variant="outline" className={cn("text-xs", config[level] || "")}>
      {level}
    </Badge>
  );
}

export function RiskStatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    Open: "bg-destructive/10 text-destructive border-destructive/20",
    Mitigated: "bg-success/10 text-success border-success/20",
    Accepted: "bg-info/10 text-info border-info/20",
  };
  return (
    <Badge variant="outline" className={cn("text-xs", config[status] || "")}>
      {status}
    </Badge>
  );
}
