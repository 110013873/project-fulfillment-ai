import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { enterprises } from "@/lib/mock-data";
import { Network, Download, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chain")({ component: ChainPage });

const layers = [
  { name: "基础层", desc: "芯片 / 硬件 / 网络基础设施", color: "from-blue-500 to-blue-700" },
  { name: "平台层", desc: "操作系统 / 数据库 / 云计算 / 大数据平台", color: "from-cyan-500 to-cyan-700" },
  { name: "应用层", desc: "行业软件 / SaaS / AI应用 / 数字内容", color: "from-emerald-500 to-emerald-700" },
  { name: "服务层", desc: "系统集成 / IT运维 / 信息安全 / 技术咨询", color: "from-amber-500 to-amber-700" },
];

function ChainPage() {
  const layerStats = layers.map((l) => {
    const ents = enterprises.filter((e) => e.chainLayer === l.name);
    return { ...l, count: ents.length, revenue: Math.round(ents.reduce((s, e) => s + e.revenue[4].value, 0) / 10000) };
  });
  const max = Math.max(...layerStats.map((l) => l.count));
  const weakest = layerStats.slice().sort((a, b) => a.count - b.count)[0];

  return (
    <AppShell>
      <PageHeader title="产业链图谱" subtitle="按上下游环节呈现本地产业链结构 · 识别薄弱环节"
        actions={<button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-input text-sm hover:bg-accent"><Download className="h-4 w-4" />导出产业链分析</button>}
      />

      <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
        <div className="text-sm">
          <span className="font-semibold">产业链薄弱环节识别：</span>
          <span className="text-muted-foreground"> 当前 <span className="font-semibold text-warning-foreground">{weakest.name}</span>（{weakest.desc}）本地企业仅 {weakest.count} 家，建议加强招商引资力度，引入优质上下游企业完善生态。</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {layerStats.map((l, idx) => {
          const heat = l.count / max;
          return (
            <div key={l.name} className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
              <div className={cn("h-1.5 bg-gradient-to-r", l.color)} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3">
                    <div className={cn("h-10 w-10 rounded-lg bg-gradient-to-br text-white flex items-center justify-center font-bold shrink-0", l.color)}>
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">{l.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{l.desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-right">
                    <div>
                      <div className="text-2xl font-bold tabular-nums">{l.count}</div>
                      <div className="text-[11px] text-muted-foreground">本地企业</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold tabular-nums">{l.revenue}</div>
                      <div className="text-[11px] text-muted-foreground">亿元营收</div>
                    </div>
                    <div>
                      <div className={cn("text-sm font-semibold px-2 py-1 rounded inline-block",
                        heat > 0.75 ? "bg-success/15 text-success" : heat > 0.5 ? "bg-info/15 text-info" : heat > 0.25 ? "bg-warning/15 text-warning-foreground" : "bg-destructive/15 text-destructive",
                      )}>
                        {heat > 0.75 ? "强" : heat > 0.5 ? "良好" : heat > 0.25 ? "一般" : "薄弱"}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1">本地密集度</div>
                    </div>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className={cn("h-full bg-gradient-to-r", l.color)} style={{ width: `${heat * 100}%` }} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {enterprises.filter((e) => e.chainLayer === l.name).slice(0, 8).map((e) => (
                    <span key={e.id} className="text-[11px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{e.name.replace("股份有限公司", "")}</span>
                  ))}
                  {enterprises.filter((e) => e.chainLayer === l.name).length > 8 && <span className="text-[11px] px-2 py-0.5 text-muted-foreground">+{enterprises.filter((e) => e.chainLayer === l.name).length - 8}家</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-lg p-5 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <Network className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">产业链上下游协同关系</h3>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed">
          产业链各环节之间存在自然的供需协同关系：基础层为平台层提供算力与硬件支撑，平台层为应用层提供开发与运行环境，应用层结合服务层共同向最终用户交付价值。本地产业链完整度评估： <span className="font-semibold text-foreground">{((layerStats.filter((l) => l.count > 5).length / 4) * 100).toFixed(0)}%</span>，建议在薄弱环节加大招商力度。
        </div>
      </div>
    </AppShell>
  );
}
