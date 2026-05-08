import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { policies } from "@/lib/mock-data";
import { Scroll, Plus, Users, CheckCircle2, FileSignature } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/policies")({ component: PoliciesPage });

const statusColor: Record<string, string> = {
  "申报中": "bg-success/15 text-success",
  "已截止": "bg-muted text-muted-foreground",
  "已废止": "bg-destructive/15 text-destructive",
};

function PoliciesPage() {
  const active = policies.filter((p) => p.status === "申报中").length;
  const totalMatched = policies.reduce((s, p) => s + p.matchedEnterprises, 0);
  const totalApplied = policies.reduce((s, p) => s + p.applied, 0);
  const totalApproved = policies.reduce((s, p) => s + p.approved, 0);

  return (
    <AppShell>
      <PageHeader title="政策兑现追踪" subtitle="政策匹配 · 申报追踪 · 兑现统计"
        actions={<button className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-primary text-primary-foreground text-sm font-medium"><Plus className="h-4 w-4" />新增政策</button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard label="在申政策" value={active} unit="项" variant="primary" icon={<Scroll className="h-4 w-4" />} />
        <StatCard label="符合条件企业" value={totalMatched} unit="家次" icon={<Users className="h-4 w-4" />} />
        <StatCard label="已申报" value={totalApplied} hint={`申报率 ${((totalApplied / totalMatched) * 100).toFixed(0)}%`} icon={<FileSignature className="h-4 w-4" />} />
        <StatCard label="已获批" value={totalApproved} hint={`获批率 ${((totalApproved / totalApplied) * 100).toFixed(0)}%`} icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {policies.map((p) => {
          const appliedRate = (p.applied / p.matchedEnterprises) * 100;
          const approvedRate = (p.approved / p.applied) * 100;
          return (
            <div key={p.id} className="bg-card border border-border rounded-lg p-5 shadow-card hover:shadow-elevated transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-sm font-semibold">{p.name}</h3>
                  <div className="text-[11px] text-muted-foreground mt-1">{p.issuer} · 发布 {p.publishDate} · 截止 {p.deadline}</div>
                </div>
                <span className={cn("text-[11px] px-2 py-0.5 rounded font-medium shrink-0", statusColor[p.status])}>{p.status}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="text-[11px] px-2 py-0.5 rounded bg-info/10 text-info">{p.type}</span>
                <span className="text-[11px] text-muted-foreground">补贴：{p.subsidy}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-4 leading-relaxed">{p.conditions}</div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                <div>
                  <div className="text-xs text-muted-foreground">符合条件</div>
                  <div className="text-lg font-bold tabular-nums">{p.matchedEnterprises}<span className="text-xs font-normal opacity-60"> 家</span></div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">已申报</div>
                  <div className="text-lg font-bold tabular-nums text-info">{p.applied}<span className="text-xs font-normal opacity-60"> 家</span></div>
                  <div className="text-[10px] text-muted-foreground">{appliedRate.toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">已获批</div>
                  <div className="text-lg font-bold tabular-nums text-success">{p.approved}<span className="text-xs font-normal opacity-60"> 家</span></div>
                  <div className="text-[10px] text-muted-foreground">{approvedRate.toFixed(0)}%</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-warning-foreground bg-warning/15 px-2 py-0.5 rounded">{p.matchedEnterprises - p.applied} 家未触达 ⚠</span>
                <button className="text-primary hover:underline">查看名单 →</button>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
