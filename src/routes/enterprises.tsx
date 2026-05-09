import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { enterprises, districts as districtList, industryList } from "@/lib/mock-data";
import { Search, Filter, Download, Plus, Crown, AlertTriangle, ExternalLink, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner";

export const Route = createFileRoute("/enterprises")({ component: EnterprisesPage });

const statusBadge: Record<string, string> = {
  "已发布": "bg-success/15 text-success",
  "待审核": "bg-warning/15 text-warning-foreground",
  "草稿": "bg-muted text-muted-foreground",
  "已停用": "bg-destructive/15 text-destructive",
};

function EnterprisesPage() {
  const { pathname } = useLocation();
  const isDetailPage = pathname !== "/enterprises";

  const [q, setQ] = useState("");
  const [district, setDistrict] = useState("");
  const [scale, setScale] = useState("");
  const [status, setStatus] = useState("");
  const [memberOnly, setMemberOnly] = useState(false);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    creditCode: "",
    district: districtList[0],
    industry: industryList[0],
    scale: "中型",
    legalRep: "",
    contactPhone: "",
  });

  const districts = Array.from(new Set(enterprises.map((e) => e.district)));
  const scales = ["大型", "中型", "小型", "微型"];

  const filtered = useMemo(() => enterprises.filter((e) =>
    (!q || e.name.includes(q) || e.creditCode.includes(q)) &&
    (!district || e.district === district) &&
    (!scale || e.scale === scale) &&
    (!status || e.status === status) &&
    (!memberOnly || e.memberLevel !== "非会员"),
  ), [q, district, scale, status, memberOnly]);

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("请输入企业名称");
      return;
    }
    toast.success(`企业「${form.name}」已创建`, { description: "数据已保存至系统中" });
    setSheetOpen(false);
    setForm({ name: "", creditCode: "", district: districtList[0], industry: industryList[0], scale: "中型", legalRep: "", contactPhone: "" });
  };

  if (isDetailPage) {
    return <Outlet />;
  }

  return (
    <AppShell>
      <PageHeader
        title="企业信息库"
        subtitle={`以统一社会信用代码为主键 · 共 ${enterprises.length} 家 · 筛选后 ${filtered.length} 家`}
        actions={
          <>
            <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-input text-sm hover:bg-accent"><Download className="h-4 w-4" />导出</button>
            <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-input text-sm hover:bg-accent">Excel导入</button>
            <button onClick={() => setSheetOpen(true)} className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"><Plus className="h-4 w-4" />新增企业</button>
          </>
        }
      />

      <div className="bg-card border border-border rounded-lg p-4 mb-4 shadow-card">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2 px-3 h-9 rounded-md border border-input flex-1 min-w-[240px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="按企业名称 / 信用代码搜索..." className="bg-transparent outline-none text-sm flex-1" />
          </div>
          <select value={district} onChange={(e) => setDistrict(e.target.value)} className="h-9 px-3 rounded-md border border-input bg-background text-sm">
            <option value="">全部区县</option>{districts.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select value={scale} onChange={(e) => setScale(e.target.value)} className="h-9 px-3 rounded-md border border-input bg-background text-sm">
            <option value="">全部规模</option>{scales.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 px-3 rounded-md border border-input bg-background text-sm">
            <option value="">全部状态</option>{["已发布", "待审核", "草稿", "已停用"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer">
            <input type="checkbox" checked={memberOnly} onChange={(e) => setMemberOnly(e.target.checked)} className="rounded" /> 仅会员
          </label>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">企业名称</th>
                <th className="text-left px-4 py-3 font-medium">所属区</th>
                <th className="text-left px-4 py-3 font-medium">行业</th>
                <th className="text-left px-4 py-3 font-medium">规模</th>
                <th className="text-right px-4 py-3 font-medium">2024营收(万)</th>
                <th className="text-left px-4 py-3 font-medium">会员等级</th>
                <th className="text-left px-4 py-3 font-medium">数据状态</th>
                <th className="text-left px-4 py-3 font-medium">来源</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.slice(0, 30).map((e) => (
                <tr key={e.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{e.name}</span>
                      {e.memberLevel !== "非会员" && <Crown className="h-3 w-3 text-warning" />}
                      {e.isListed && <span className="text-[10px] px-1 py-0.5 rounded bg-info/15 text-info font-medium">上市</span>}
                      {e.riskLevel !== "无" && <AlertTriangle className={cn("h-3 w-3", e.riskLevel === "红" && "text-destructive", e.riskLevel === "橙" && "text-warning", e.riskLevel === "黄" && "text-warning")} />}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{e.creditCode}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{e.district}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.industries.join(", ")}</td>
                  <td className="px-4 py-3"><span className="text-xs px-1.5 py-0.5 rounded bg-muted">{e.scale}</span></td>
                  <td className="px-4 py-3 text-right tabular-nums">{e.revenue[4].value.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs">{e.memberLevel}</td>
                  <td className="px-4 py-3"><span className={cn("text-[11px] px-2 py-0.5 rounded font-medium", statusBadge[e.status])}>{e.status}</span></td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground">{e.source}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to="/enterprises/$id" params={{ id: e.id }} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">详情<ExternalLink className="h-3 w-3" /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
          <span>显示前 30 条 / 共 {filtered.length} 条</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 rounded border border-input hover:bg-accent">上一页</button>
            <button className="px-2 py-1 rounded border border-input bg-primary text-primary-foreground">1</button>
            <button className="px-2 py-1 rounded border border-input hover:bg-accent">2</button>
            <button className="px-2 py-1 rounded border border-input hover:bg-accent">下一页</button>
          </div>
        </div>
      </div>

      {/* 新增企业侧滑面板 */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>新增企业</SheetTitle>
            <SheetDescription>录入企业基础信息，系统将自动分配统一社会信用代码</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div>
              <label className="text-sm font-medium mb-1.5 block">企业名称 <span className="text-destructive">*</span></label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="输入企业全称" className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">统一社会信用代码</label>
              <input value={form.creditCode} onChange={(e) => setForm({ ...form, creditCode: e.target.value })} placeholder="91XXXXXXXXXXXXXX" className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">所属区县</label>
                <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm outline-none">
                  {districtList.map((d: string) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">企业规模</label>
                <select value={form.scale} onChange={(e) => setForm({ ...form, scale: e.target.value })} className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm outline-none">
                  {scales.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">主营行业</label>
              <select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm outline-none">
                {industryList.map((ind: string) => <option key={ind}>{ind}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">法定代表人</label>
                <input value={form.legalRep} onChange={(e) => setForm({ ...form, legalRep: e.target.value })} placeholder="姓名" className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">联系电话</label>
                <input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} placeholder="138****8888" className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-1 focus:ring-ring" />
              </div>
            </div>
            <div className="pt-4 flex gap-2">
              <button onClick={handleSubmit} className="flex-1 h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">保存</button>
              <button onClick={() => setSheetOpen(false)} className="flex-1 h-9 rounded-md border border-input text-sm hover:bg-accent">取消</button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
