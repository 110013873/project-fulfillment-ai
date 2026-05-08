import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { enterprises, tenders } from "@/lib/mock-data";
import { useState, useMemo } from "react";
import { Search, Download } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";

export const Route = createFileRoute("/tenders")({ component: TendersPage });

const COLORS = ["oklch(0.55 0.18 252)", "oklch(0.65 0.13 200)", "oklch(0.62 0.15 155)", "oklch(0.74 0.16 70)"];

function TendersPage() {
  const [q, setQ] = useState("");
  const [year, setYear] = useState<string>("");
  const filtered = useMemo(() => tenders.filter((t) =>
    (!q || t.projectName.includes(q) || t.enterpriseName.includes(q)) &&
    (!year || t.year === Number(year))
  ), [q, year]);

  const top10 = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((t) => map.set(t.enterpriseName, (map.get(t.enterpriseName) || 0) + t.amount));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, amount]) => ({ name: name.replace("股份有限公司", ""), amount }));
  }, [filtered]);

  const byType = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((t) => map.set(t.projectType, (map.get(t.projectType) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  return (
    <AppShell>
      <PageHeader title="招投标数据" subtitle={`累计采集 ${tenders.length} 条招投标记录 · 数据源：政府采购网/招投标交易平台`}
        actions={<button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-input text-sm hover:bg-accent"><Download className="h-4 w-4" />导出</button>} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-card border border-border rounded-lg p-5 shadow-card">
          <h3 className="text-sm font-semibold mb-3">中标金额 Top10 企业</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={top10} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
              <Tooltip />
              <Bar dataKey="amount" fill="oklch(0.55 0.18 252)" name="金额(万)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 shadow-card">
          <h3 className="text-sm font-semibold mb-3">项目类型分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={byType} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label>
                {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 mb-4 shadow-card">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 h-9 rounded-md border border-input flex-1 min-w-[240px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="项目名称 / 企业名称..." className="bg-transparent outline-none text-sm flex-1" />
          </div>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="h-9 px-3 rounded-md border border-input bg-background text-sm">
            <option value="">全部年份</option>{[2024, 2023, 2022].map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs text-muted-foreground uppercase">
              <tr>
                <th className="text-left px-4 py-3">项目名称</th>
                <th className="text-left px-4 py-3">中标企业</th>
                <th className="text-left px-4 py-3">招标方</th>
                <th className="text-left px-4 py-3">区域</th>
                <th className="text-left px-4 py-3">类型</th>
                <th className="text-right px-4 py-3">金额(万)</th>
                <th className="text-left px-4 py-3">日期</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.slice(0, 30).map((t) => (
                <tr key={t.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3">{t.projectName}<div className="text-[11px] text-muted-foreground">{t.projectCode}</div></td>
                  <td className="px-4 py-3 text-muted-foreground">{t.enterpriseName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.tenderee}</td>
                  <td className="px-4 py-3"><span className="text-[11px] px-1.5 py-0.5 rounded bg-muted">{t.tendereeRegion}</span></td>
                  <td className="px-4 py-3"><span className="text-[11px] px-1.5 py-0.5 rounded bg-muted">{t.projectType}</span></td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">{t.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
