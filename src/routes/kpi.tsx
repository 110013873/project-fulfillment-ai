import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { kpis } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, Download, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/kpi")({ component: KpiPage });

function KpiPage() {
  return (
    <AppShell>
      <PageHeader title="产业发展 KPI 看板" subtitle="对应工信部、省厅、市政府年度产业考核指标体系"
        actions={
          <>
            <select className="h-9 px-3 rounded-md border border-input bg-background text-sm"><option>2025年</option><option>2024年</option></select>
            <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-input text-sm hover:bg-accent"><Download className="h-4 w-4" />导出统计表</button>
          </>
        }
      />

      <div className="bg-gradient-navy text-navy-foreground rounded-lg p-6 mb-4 shadow-elevated">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">2025年度核心指标完成情况</h2>
            <p className="text-sm opacity-70 mt-1">数据截至 {new Date().toLocaleDateString("zh-CN")} · 信息化局口径</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold tabular-nums">62.5%</div>
            <div className="text-xs opacity-70">综合完成率</div>
          </div>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-gradient-primary" style={{ width: "62.5%" }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((k) => {
          const delta = ((k.current - k.prev) / k.prev) * 100;
          const progress = k.target ? (k.current / k.target) * 100 : null;
          return (
            <div key={k.name} className="bg-card border border-border rounded-lg p-5 shadow-card hover:shadow-elevated transition-shadow">
              <div className="text-xs text-muted-foreground">{k.name}</div>
              <div className="flex items-baseline gap-1.5 mt-1.5">
                <span className="text-3xl font-bold tabular-nums">{k.current}</span>
                <span className="text-sm text-muted-foreground">{k.unit}</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className={cn("inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-medium",
                  delta >= 0 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
                )}>
                  {delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {delta >= 0 ? "+" : ""}{delta.toFixed(1)}%
                </span>
                <span className="text-muted-foreground">较去年 {k.prev}{k.unit}</span>
              </div>
              {k.target !== undefined && progress !== null && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground inline-flex items-center gap-1"><Target className="h-3 w-3" />年度目标 {k.target}{k.unit}</span>
                    <span className="font-medium">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className={cn("h-full rounded-full", progress >= 80 ? "bg-success" : progress >= 50 ? "bg-info" : "bg-warning")} style={{ width: `${Math.min(100, progress)}%` }} />
                  </div>
                </div>
              )}
              <div className="mt-2 text-[10px] text-muted-foreground">数据来源：{k.source}</div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
