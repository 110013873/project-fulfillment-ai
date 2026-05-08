import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { activities } from "@/lib/mock-data";
import { Plus, Calendar, MapPin, Users } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/activities")({ component: ActivitiesPage });

const statusColor: Record<string, string> = {
  "已举办": "bg-success/15 text-success",
  "筹备中": "bg-info/15 text-info",
  "已取消": "bg-muted text-muted-foreground",
};

function ActivitiesPage() {
  const held = activities.filter((a) => a.status === "已举办");
  const totalParticipants = held.reduce((s, a) => s + a.participants, 0);
  const totalEnts = new Set(held.flatMap((a) => a.enterpriseIds)).size;

  return (
    <AppShell>
      <PageHeader title="协会活动管理" subtitle="活动筹划、参与企业记录与成果统计"
        actions={<button className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-primary text-primary-foreground text-sm font-medium"><Plus className="h-4 w-4" />新建活动</button>} />

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
    </AppShell>
  );
}
