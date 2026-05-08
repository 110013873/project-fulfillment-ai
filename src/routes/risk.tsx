import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { enterprises } from "@/lib/mock-data";
import { AlertTriangle, Download } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/risk")({ component: RiskPage });

const levelStyle: Record<string, string> = {
  "红": "bg-destructive/15 text-destructive border-destructive/30",
  "橙": "bg-warning/20 text-warning-foreground border-warning/40",
  "黄": "bg-warning/10 text-warning-foreground border-warning/30",
};

function RiskPage() {
  const risks = enterprises.filter((e) => e.riskLevel !== "无").sort((a, b) => {
    const order = { "红": 0, "橙": 1, "黄": 2, "无": 3 };
    return order[a.riskLevel] - order[b.riskLevel];
  });
  const red = risks.filter((r) => r.riskLevel === "红").length;
  const orange = risks.filter((r) => r.riskLevel === "橙").length;
  const yellow = risks.filter((r) => r.riskLevel === "黄").length;

  return (
    <AppShell>
      <PageHeader title="企业风险预警中心" subtitle="多维风险信号自动监测，提前介入支持"
        actions={<button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-input text-sm hover:bg-accent"><Download className="h-4 w-4" />导出预警清单</button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard label="红级风险" value={red} unit="家" hint="需立即处置" icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="橙级风险" value={orange} unit="家" hint="重点关注" icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="黄级风险" value={yellow} unit="家" hint="持续观察" icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="本月新增预警" value={5} unit="家" />
      </div>

      <div className="bg-card border border-border rounded-lg p-5 mb-4 shadow-card">
        <h3 className="text-sm font-semibold mb-3">预警规则</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          {[
            { type: "失信被执行人 / 经营异常", level: "红" },
            { type: "连续亏损 / 营收大幅下滑", level: "橙" },
            { type: "新增行政处罚", level: "橙" },
            { type: "招投标骤降 / 高管频变", level: "黄" },
            { type: "核心资质即将到期", level: "黄" },
            { type: "数据长期未更新", level: "黄" },
          ].map((r) => (
            <div key={r.type} className="flex items-center gap-2 px-3 py-2 rounded bg-secondary/40">
              <span className={cn("inline-block w-2 h-2 rounded-full", r.level === "红" && "bg-destructive", r.level === "橙" && "bg-warning", r.level === "黄" && "bg-warning/60")} />
              <span>{r.type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">预警企业列表 ({risks.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs text-muted-foreground uppercase">
              <tr>
                <th className="text-left px-4 py-3">风险等级</th>
                <th className="text-left px-4 py-3">企业</th>
                <th className="text-left px-4 py-3">风险类型</th>
                <th className="text-left px-4 py-3">所属区</th>
                <th className="text-left px-4 py-3">规模</th>
                <th className="text-left px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {risks.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3"><span className={cn("inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border font-medium", levelStyle[r.riskLevel])}><AlertTriangle className="h-3 w-3" />{r.riskLevel}级</span></td>
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.riskTypes.join(", ")}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.district}</td>
                  <td className="px-4 py-3"><span className="text-[11px] px-1.5 py-0.5 rounded bg-muted">{r.scale}</span></td>
                  <td className="px-4 py-3"><button className="text-xs text-primary hover:underline">已知悉</button> · <button className="text-xs text-primary hover:underline">备注</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
