import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { reports } from "@/lib/mock-data";
import { FileBarChart, Download, FileText, Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports")({ component: ReportsPage });

const typeColor: Record<string, string> = {
  "年度行业发展报告": "bg-primary/15 text-primary",
  "季度动态简报": "bg-info/15 text-info",
  "专项分析报告": "bg-warning/15 text-warning-foreground",
  "统计报表": "bg-success/15 text-success",
};

function ReportsPage() {
  return (
    <AppShell>
      <PageHeader title="行业分析报告 & 统计报表" subtitle="基于平台数据自动生成结构化报告"
        actions={
          <>
            <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-input text-sm hover:bg-accent"><Sparkles className="h-4 w-4 text-primary" />智能生成</button>
            <button className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-primary text-primary-foreground text-sm font-medium"><Plus className="h-4 w-4" />新建报告</button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { name: "软件业统计报表", desc: "工信部口径 · Excel" },
          { name: "信息产业年度数据摘要", desc: "市政府汇报模板" },
          { name: "高新技术企业统计表", desc: "科技部口径" },
          { name: "专精特新企业汇总表", desc: "工信部口径" },
        ].map((t) => (
          <div key={t.name} className="bg-card border border-border rounded-lg p-4 shadow-card hover:shadow-elevated transition-shadow group cursor-pointer">
            <FileText className="h-5 w-5 text-primary mb-2" />
            <div className="text-sm font-semibold">{t.name}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{t.desc}</div>
            <div className="mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">一键生成 →</div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">已发布 / 草稿报告</h3>
        </div>
        <div className="divide-y divide-border">
          {reports.map((r) => (
            <div key={r.id} className="px-5 py-4 flex items-start gap-4 hover:bg-secondary/40">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary text-primary-foreground flex items-center justify-center shrink-0">
                <FileBarChart className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-sm">{r.title}</h4>
                  <span className={cn("text-[11px] px-2 py-0.5 rounded", typeColor[r.type])}>{r.type}</span>
                  <span className={cn("text-[11px] px-2 py-0.5 rounded", r.status === "已发布" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>{r.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{r.summary}</p>
                <div className="text-[11px] text-muted-foreground mt-2">{r.date} · {r.author}</div>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <button className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-input hover:bg-accent"><Download className="h-3 w-3" />PDF</button>
                <button className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-input hover:bg-accent"><Download className="h-3 w-3" />Word</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
