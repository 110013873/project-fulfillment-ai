import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { enterprises } from "@/lib/mock-data";
import { Award, Plus, Bell } from "lucide-react";
import { StatCard } from "@/components/StatCard";

export const Route = createFileRoute("/honors")({ component: HonorsPage });

const honorTypes = ["高新技术企业", "国家级专精特新", "省级专精特新", "软件企业", "CMMI 5", "市级龙头企业"];

function HonorsPage() {
  const counts = honorTypes.map((h) => ({ name: h, count: enterprises.filter((e) => e.honors.includes(h)).length, last: Math.floor(Math.random() * 20) + 5 }));

  return (
    <AppShell>
      <PageHeader title="荣誉资质追踪" subtitle="高新技术企业、专精特新等核心资质动态追踪与到期提醒"
        actions={<button className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-primary text-primary-foreground text-sm font-medium"><Plus className="h-4 w-4" />录入资质</button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard label="高新技术企业" value={counts[0].count} unit="家" delta={13} hint="本年新增18" variant="primary" icon={<Award className="h-4 w-4" />} />
        <StatCard label="国家级专精特新" value={counts[1].count} unit="家" delta={33} icon={<Award className="h-4 w-4" />} />
        <StatCard label="上市企业" value={enterprises.filter((e) => e.isListed).length} unit="家" delta={20} />
        <StatCard label="即将到期" value={6} unit="项" hint="90天内复审" icon={<Bell className="h-4 w-4 text-warning" />} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {counts.map((c) => (
          <div key={c.name} className="bg-card border border-border rounded-lg p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-warning" />
              <div className="text-xs text-muted-foreground">{c.name}</div>
            </div>
            <div className="text-2xl font-bold tabular-nums">{c.count}</div>
            <div className="text-[11px] text-success mt-1">↑ 较去年 +{c.last}</div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">资质明细</h3>
          <button className="text-xs text-primary hover:underline">导出资质统计表</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs text-muted-foreground uppercase">
              <tr>
                <th className="text-left px-4 py-3">企业</th>
                <th className="text-left px-4 py-3">资质类型</th>
                <th className="text-left px-4 py-3">认定机构</th>
                <th className="text-left px-4 py-3">认定日期</th>
                <th className="text-left px-4 py-3">有效期至</th>
                <th className="text-left px-4 py-3">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {enterprises.flatMap((e) => e.honors.map((h) => ({ ent: e, honor: h }))).slice(0, 25).map((row, i) => (
                <tr key={i} className="hover:bg-secondary/40">
                  <td className="px-4 py-3 font-medium">{row.ent.name}</td>
                  <td className="px-4 py-3"><span className="text-[11px] px-2 py-0.5 rounded bg-warning/15 text-warning-foreground">{row.honor}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{row.honor.includes("高新") ? "科技部" : row.honor.includes("专精特新") ? "工信部" : "省工信厅"}</td>
                  <td className="px-4 py-3 text-muted-foreground">202{2 + (i % 3)}-0{1 + (i % 9)}-15</td>
                  <td className="px-4 py-3 text-muted-foreground">202{5 + (i % 2)}-0{1 + (i % 9)}-15</td>
                  <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded ${i % 7 === 0 ? "bg-warning/15 text-warning-foreground" : "bg-success/15 text-success"}`}>{i % 7 === 0 ? "即将到期" : "有效"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
