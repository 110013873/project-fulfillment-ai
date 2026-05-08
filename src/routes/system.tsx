import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { systemUsers, auditLogs } from "@/lib/mock-data";
import { Settings, Users, FileText, Database, BookOpen, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/system")({ component: SystemPage });

const tabs = [
  { id: "users", label: "用户管理", icon: Users },
  { id: "dict", label: "数据字典", icon: BookOpen },
  { id: "logs", label: "操作日志", icon: FileText },
  { id: "backup", label: "备份恢复", icon: Database },
];

const dictGroups = [
  { name: "行业分类", count: 8, items: ["软件与信息服务", "电子信息制造", "通信与网络", "信息安全", "人工智能", "大数据与云计算", "数字内容与文创", "IT服务与集成"] },
  { name: "公司性质", count: 5, items: ["国有", "民营", "外资", "合资", "其他"] },
  { name: "企业规模", count: 4, items: ["大型", "中型", "小型", "微型"] },
  { name: "会员等级", count: 5, items: ["会长单位", "副会长单位", "常务理事单位", "理事单位", "普通会员单位"] },
  { name: "荣誉资质类型", count: 6, items: ["高新技术企业", "国家级专精特新", "省级专精特新", "软件企业", "CMMI 5", "市级龙头企业"] },
  { name: "活动类型", count: 6, items: ["培训", "论坛", "对接会", "参观考察", "政策宣讲", "其他"] },
];

function SystemPage() {
  const [tab, setTab] = useState("users");

  return (
    <AppShell>
      <PageHeader title="系统设置" subtitle="用户权限、数据字典、操作日志、备份恢复" />

      <div className="flex gap-1 mb-4 border-b border-border">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
              tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground",
            )}><Icon className="h-4 w-4" />{t.label}</button>
          );
        })}
      </div>

      {tab === "users" && (
        <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">系统用户</h3>
            <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium"><Plus className="h-3.5 w-3.5" />新增用户</button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs text-muted-foreground uppercase">
              <tr>
                <th className="text-left px-4 py-3">用户名</th>
                <th className="text-left px-4 py-3">姓名</th>
                <th className="text-left px-4 py-3">角色</th>
                <th className="text-left px-4 py-3">邮箱</th>
                <th className="text-left px-4 py-3">状态</th>
                <th className="text-left px-4 py-3">最近登录</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {systemUsers.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3 font-mono text-xs">{u.username}</td>
                  <td className="px-4 py-3 font-medium">{u.realName}</td>
                  <td className="px-4 py-3"><span className={cn("text-[11px] px-2 py-0.5 rounded font-medium",
                    u.role === "系统管理员" ? "bg-destructive/15 text-destructive" :
                    u.role === "协会管理员" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground")}>{u.role}</span></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{u.email}</td>
                  <td className="px-4 py-3"><span className={cn("text-[11px] px-2 py-0.5 rounded", u.status === "启用" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>{u.status}</span></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{u.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "dict" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dictGroups.map((g) => (
            <div key={g.name} className="bg-card border border-border rounded-lg p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />{g.name}</h3>
                <span className="text-xs text-muted-foreground">{g.count} 项</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((it) => <span key={it} className="text-[11px] px-2 py-1 rounded bg-secondary">{it}</span>)}
              </div>
              <button className="mt-3 text-xs text-primary hover:underline">+ 添加</button>
            </div>
          ))}
        </div>
      )}

      {tab === "logs" && (
        <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs text-muted-foreground uppercase">
              <tr>
                <th className="text-left px-4 py-3">时间</th>
                <th className="text-left px-4 py-3">操作人</th>
                <th className="text-left px-4 py-3">操作</th>
                <th className="text-left px-4 py-3">对象</th>
                <th className="text-left px-4 py-3">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {auditLogs.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{l.time}</td>
                  <td className="px-4 py-3">{l.user}</td>
                  <td className="px-4 py-3"><span className="text-[11px] px-2 py-0.5 rounded bg-info/15 text-info">{l.action}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{l.target}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "backup" && (
        <div className="bg-card border border-border rounded-lg p-6 shadow-card">
          <h3 className="text-sm font-semibold mb-4">数据备份与恢复</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4">
              <div className="text-xs text-muted-foreground">最近一次自动备份</div>
              <div className="text-lg font-semibold mt-1">2025-05-08 02:00</div>
              <div className="text-xs text-muted-foreground mt-1">备份大小: 2.34 GB · 状态: 成功</div>
              <button className="mt-3 inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs">立即手动备份</button>
            </div>
            <div className="border border-border rounded-lg p-4">
              <div className="text-xs text-muted-foreground">备份保留策略</div>
              <div className="text-sm mt-1">保留最近 <span className="font-semibold">30 天</span> 自动备份</div>
              <div className="text-xs text-muted-foreground mt-3">当前已存储备份: 28 份</div>
              <button className="mt-3 inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-input text-xs hover:bg-accent">查看备份历史</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
