import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { crawlerTasks } from "@/lib/mock-data";
import { Play, Pause, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/crawler")({ component: CrawlerPage });

const statusStyle: Record<string, string> = {
  "运行中": "bg-success/15 text-success",
  "已停用": "bg-muted text-muted-foreground",
  "失败": "bg-destructive/15 text-destructive",
};

function CrawlerPage() {
  const running = crawlerTasks.filter((t) => t.status === "运行中").length;
  const failed = crawlerTasks.filter((t) => t.status === "失败").length;
  const totalSuccess = crawlerTasks.reduce((s, t) => s + t.successCount, 0);
  const totalFail = crawlerTasks.reduce((s, t) => s + t.failCount, 0);

  return (
    <AppShell>
      <PageHeader title="数据采集任务管理" subtitle="爬虫任务调度、监控与待审核队列" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard label="运行中任务" value={running} unit="个" icon={<RefreshCw className="h-4 w-4" />} variant="primary" />
        <StatCard label="失败任务" value={failed} unit="个" icon={<AlertCircle className="h-4 w-4 text-destructive" />} />
        <StatCard label="累计采集成功" value={totalSuccess.toLocaleString()} icon={<CheckCircle2 className="h-4 w-4 text-success" />} />
        <StatCard label="待审核数据" value={42} unit="条" hint="需人工核实" />
      </div>

      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">爬虫任务列表</h3>
          <button className="text-xs text-primary hover:underline">+ 新建任务</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs text-muted-foreground uppercase">
              <tr>
                <th className="text-left px-4 py-3">任务名称</th>
                <th className="text-left px-4 py-3">数据源</th>
                <th className="text-left px-4 py-3">类型</th>
                <th className="text-left px-4 py-3">频率</th>
                <th className="text-left px-4 py-3">上次执行</th>
                <th className="text-left px-4 py-3">下次计划</th>
                <th className="text-left px-4 py-3">状态</th>
                <th className="text-right px-4 py-3">成功/失败</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {crawlerTasks.map((t) => (
                <tr key={t.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3 font-medium">{t.name}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{t.source}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.type}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{t.frequency}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{t.lastRun}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{t.nextRun}</td>
                  <td className="px-4 py-3"><span className={cn("text-[11px] px-2 py-0.5 rounded font-medium", statusStyle[t.status])}>{t.status}</span></td>
                  <td className="px-4 py-3 text-right text-xs"><span className="text-success tabular-nums">{t.successCount}</span> / <span className="text-destructive tabular-nums">{t.failCount}</span></td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1 rounded hover:bg-accent" title="立即执行"><Play className="h-3.5 w-3.5" /></button>
                    <button className="p-1 rounded hover:bg-accent" title="暂停"><Pause className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-5 shadow-card">
        <h3 className="text-sm font-semibold mb-3">告警规则</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {[
            "爬虫任务连续失败3次 → 邮件 + 站内通知",
            "企业数据超过180天未更新 → 站内提醒",
            "重大中标(>1000万) → 即时推送",
            "数据导入错误率 > 20% → 弹窗",
            "会费即将到期 → 站内提醒",
            "核心资质即将到期 → 站内提醒",
          ].map((r) => (
            <div key={r} className="flex items-center gap-2 px-3 py-2 rounded bg-secondary/40">
              <AlertCircle className="h-3.5 w-3.5 text-warning" />{r}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
