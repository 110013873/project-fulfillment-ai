import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { activities, enterprises } from "@/lib/mock-data";
import { Plus, Calendar, MapPin, Users } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner";

export const Route = createFileRoute("/activities")({ component: ActivitiesPage });

const statusColor: Record<string, string> = {
  "已举办": "bg-success/15 text-success",
  "筹备中": "bg-info/15 text-info",
  "已取消": "bg-muted text-muted-foreground",
};

function ActivitiesPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "行业交流",
    date: new Date().toISOString().slice(0, 10),
    location: "郑州",
    participants: "50",
  });

  const held = activities.filter((a) => a.status === "已举办");
  const totalParticipants = held.reduce((s, a) => s + a.participants, 0);
  const totalEnts = new Set(held.flatMap((a) => a.enterpriseIds)).size;

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("请输入活动名称");
      return;
    }
    toast.success(`活动「${form.name}」已创建`);
    setSheetOpen(false);
    setForm({ name: "", type: "行业交流", date: new Date().toISOString().slice(0, 10), location: "郑州", participants: "50" });
  };

  return (
    <AppShell>
      <PageHeader title="协会活动管理" subtitle="活动筹划、参与企业记录与成果统计"
        actions={<button onClick={() => setSheetOpen(true)} className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-primary text-primary-foreground text-sm font-medium cursor-pointer"><Plus className="h-4 w-4" />新建活动</button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard label="本年活动场次" value={held.length} unit="场" delta={20} variant="primary" icon={<Calendar className="h-4 w-4" />} />
        <StatCard label="覆盖企业(去重)" value={totalEnts} unit="家" />
        <StatCard label="累计参与人次" value={totalParticipants.toLocaleString()} hint="人次" icon={<Users className="h-4 w-4" />} />
        <StatCard label="筹备中" value={activities.filter((a) => a.status === "筹备中").length} unit="场" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((a) => (
          <div key={a.id} className="bg-card border border-border rounded-lg shadow-card overflow-hidden hover:shadow-elevated transition-shadow">
            <div className="h-1.5 bg-gradient-primary" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm leading-tight">{a.name}</h3>
                <span className={cn("text-[11px] px-2 py-0.5 rounded font-medium shrink-0", statusColor[a.status])}>{a.status}</span>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />{a.date}</div>
                <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{a.location}</div>
                <div className="flex items-center gap-1.5"><Users className="h-3 w-3" />参与企业 {a.enterpriseIds.length} 家 · {a.participants} 人次</div>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[11px] px-2 py-0.5 rounded bg-info/10 text-info">{a.type}</span>
                <button className="text-xs text-primary hover:underline">查看详情</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 新建活动侧滑面板 */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>新建活动</SheetTitle>
            <SheetDescription>创建协会活动，填写基本信息后可进入筹备阶段</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div>
              <label className="text-sm font-medium mb-1.5 block">活动名称 <span className="text-destructive">*</span></label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="如：2025 协会年会" className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">活动类型</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm outline-none">
                  {Array.from(new Set(activities.map((a) => a.type))).map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">活动日期</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-1 focus:ring-ring" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">活动地点</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="如：郑州市会展中心" className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">预计参与人数</label>
              <input type="number" value={form.participants} onChange={(e) => setForm({ ...form, participants: e.target.value })} className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-1 focus:ring-ring" />
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
