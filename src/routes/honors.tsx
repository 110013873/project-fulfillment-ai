import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { enterprises } from "@/lib/mock-data";
import { Award, Plus, Bell } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner";

export const Route = createFileRoute("/honors")({ component: HonorsPage });

const honorTypes = ["高新技术企业", "国家级专精特新", "省级专精特新", "软件企业", "CMMI 5", "市级龙头企业"];

function HonorsPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState({
    enterprise: enterprises[0]?.name || "",
    honor: "高新技术企业",
    agency: "科技部",
    date: "2025-01-01",
    expire: "2028-01-01",
  });

  const counts = honorTypes.map((h) => ({ name: h, count: enterprises.filter((e) => e.honors.includes(h)).length, last: Math.floor(Math.random() * 20) + 5 }));

  const handleSubmit = () => {
    if (!form.enterprise.trim()) {
      toast.error("请选择企业");
      return;
    }
    toast.success(`已为「${form.enterprise}」录入「${form.honor}」资质`);
    setSheetOpen(false);
  };

  return (
    <AppShell>
      <PageHeader title="荣誉资质追踪" subtitle="高新技术企业、专精特新等核心资质动态追踪与到期提醒"
        actions={<button onClick={() => setSheetOpen(true)} className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-primary text-primary-foreground text-sm font-medium cursor-pointer"><Plus className="h-4 w-4" />录入资质</button>} />

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

      {/* 录入资质侧滑面板 */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>录入资质</SheetTitle>
            <SheetDescription>为企业录入新的荣誉资质或认定</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div>
              <label className="text-sm font-medium mb-1.5 block">企业名称 <span className="text-destructive">*</span></label>
              <select value={form.enterprise} onChange={(e) => setForm({ ...form, enterprise: e.target.value })} className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm outline-none">
                {enterprises.map((e) => <option key={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">资质类型</label>
              <select value={form.honor} onChange={(e) => setForm({ ...form, honor: e.target.value })} className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm outline-none">
                {honorTypes.map((h) => <option key={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">认定机构</label>
              <input value={form.agency} onChange={(e) => setForm({ ...form, agency: e.target.value })} className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">认定日期</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">有效期至</label>
                <input type="date" value={form.expire} onChange={(e) => setForm({ ...form, expire: e.target.value })} className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-1 focus:ring-ring" />
              </div>
            </div>
            <div className="pt-4 flex gap-2">
              <button onClick={handleSubmit} className="flex-1 h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 cursor-pointer">保存</button>
              <button onClick={() => setSheetOpen(false)} className="flex-1 h-9 rounded-md border border-input text-sm hover:bg-accent cursor-pointer">取消</button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
