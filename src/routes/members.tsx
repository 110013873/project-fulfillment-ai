import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { enterprises } from "@/lib/mock-data";
import { Crown, Plus, Bell } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner";

export const Route = createFileRoute("/members")({ component: MembersPage });

const levelOrder = ["会长单位", "副会长单位", "常务理事单位", "理事单位", "普通会员单位"];
const levelStyle: Record<string, string> = {
  "会长单位": "bg-gradient-to-r from-warning to-warning/70 text-warning-foreground",
  "副会长单位": "bg-warning/20 text-warning-foreground",
  "常务理事单位": "bg-info/20 text-info-foreground",
  "理事单位": "bg-primary/15 text-primary",
  "普通会员单位": "bg-muted text-muted-foreground",
};
const fees: Record<string, number> = { "会长单位": 100000, "副会长单位": 60000, "常务理事单位": 30000, "理事单位": 15000, "普通会员单位": 5000 };

function MembersPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState({
    enterprise: enterprises.find((e) => e.memberLevel === "非会员")?.name || enterprises[0]?.name || "",
    level: "普通会员单位",
    joinDate: new Date().toISOString().slice(0, 10),
  });

  const members = enterprises.filter((e) => e.memberLevel !== "非会员");
  const totalFee = members.reduce((s, m) => s + (fees[m.memberLevel] || 0), 0);
  const expiringSoon = members.slice(0, 4);

  const handleSubmit = () => {
    toast.success(`「${form.enterprise}」已添加为${form.level}`);
    setSheetOpen(false);
  };

  return (
    <AppShell>
      <PageHeader title="会员管理" subtitle="协会会员信息、会费管理与到期提醒"
        actions={<button onClick={() => setSheetOpen(true)} className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-primary text-primary-foreground text-sm font-medium"><Plus className="h-4 w-4" />新增会员</button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard label="在册会员" value={members.length} unit="家" icon={<Crown className="h-4 w-4" />} variant="primary" />
        <StatCard label="本年应收会费" value={(totalFee / 10000).toFixed(1)} unit="万元" delta={8.2} />
        <StatCard label="本年已收" value={(totalFee * 0.78 / 10000).toFixed(1)} unit="万元" hint="缴纳率 78%" />
        <StatCard label="即将到期" value={expiringSoon.length} unit="家" hint="30天内" icon={<Bell className="h-4 w-4 text-warning" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="bg-card border border-border rounded-lg p-5 shadow-card">
          <h3 className="text-sm font-semibold mb-3">会员等级结构</h3>
          <div className="space-y-3">
            {levelOrder.map((lv) => {
              const count = members.filter((m) => m.memberLevel === lv).length;
              const pct = (count / members.length) * 100;
              return (
                <div key={lv}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium">{lv}</span>
                    <span className="text-muted-foreground tabular-nums">{count} 家</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="lg:col-span-2 bg-card border border-border rounded-lg shadow-card">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Bell className="h-4 w-4 text-warning" />会费即将到期提醒</h3>
            <button className="text-xs text-primary hover:underline">批量发送提醒</button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-2">企业</th>
                <th className="text-left px-5 py-2">等级</th>
                <th className="text-right px-5 py-2">会费</th>
                <th className="text-left px-5 py-2">到期日</th>
                <th className="text-left px-5 py-2">剩余</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {expiringSoon.map((m, i) => (
                <tr key={m.id}>
                  <td className="px-5 py-3 font-medium">{m.name}</td>
                  <td className="px-5 py-3"><span className={cn("text-[11px] px-2 py-0.5 rounded font-medium", levelStyle[m.memberLevel])}>{m.memberLevel}</span></td>
                  <td className="px-5 py-3 text-right tabular-nums">¥{(fees[m.memberLevel] || 0).toLocaleString()}</td>
                  <td className="px-5 py-3 text-muted-foreground">2025-{String(6 + i).padStart(2, "0")}-15</td>
                  <td className="px-5 py-3"><span className="text-[11px] px-2 py-0.5 rounded bg-warning/15 text-warning-foreground">{7 + i * 8} 天</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">会员名册</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs text-muted-foreground uppercase">
              <tr>
                <th className="text-left px-4 py-3">会员单位</th>
                <th className="text-left px-4 py-3">等级</th>
                <th className="text-left px-4 py-3">入会时间</th>
                <th className="text-right px-4 py-3">年会费(元)</th>
                <th className="text-left px-4 py-3">缴纳状态</th>
                <th className="text-left px-4 py-3">联系人</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.slice(0, 20).map((m, i) => (
                <tr key={m.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3 font-medium flex items-center gap-1.5"><Crown className="h-3 w-3 text-warning" />{m.name}</td>
                  <td className="px-4 py-3"><span className={cn("text-[11px] px-2 py-0.5 rounded font-medium", levelStyle[m.memberLevel])}>{m.memberLevel}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{m.memberJoinDate}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{(fees[m.memberLevel] || 0).toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={cn("text-[11px] px-2 py-0.5 rounded font-medium", i % 4 === 0 ? "bg-warning/15 text-warning-foreground" : "bg-success/15 text-success")}>{i % 4 === 0 ? "未缴" : "已缴"}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{m.legalRep} · 138****{String(1000 + i).slice(0, 4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 新增会员侧滑面板 */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>新增会员</SheetTitle>
            <SheetDescription>将企业纳入协会会员体系，设置会员等级与会费标准</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div>
              <label className="text-sm font-medium mb-1.5 block">选择企业 <span className="text-destructive">*</span></label>
              <select value={form.enterprise} onChange={(e) => setForm({ ...form, enterprise: e.target.value })} className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm outline-none">
                {enterprises.filter((e) => e.memberLevel === "非会员").map((e) => (
                  <option key={e.id}>{e.name}</option>
                ))}
              </select>
              {enterprises.filter((e) => e.memberLevel === "非会员").length === 0 && (
                <p className="text-[11px] text-muted-foreground mt-1">暂无可添加的非会员企业</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">会员等级</label>
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm outline-none">
                {levelOrder.map((lv) => <option key={lv}>{lv}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">年会费</label>
              <div className="h-9 px-3 rounded-md border border-input bg-secondary/30 text-sm flex items-center">
                ¥{(fees[form.level] || 0).toLocaleString()}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">入会日期</label>
              <input type="date" value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-1 focus:ring-ring" />
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
