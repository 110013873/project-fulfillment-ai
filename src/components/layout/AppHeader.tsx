import { Bell, Search, User, Maximize2 } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

const titleMap: Record<string, string> = {
  "/": "总览首页",
  "/cockpit": "数据驾驶舱",
  "/kpi": "产业发展 KPI 看板",
  "/map": "产业地图",
  "/chain": "产业链图谱",
  "/enterprises": "企业信息库",
  "/tenders": "招投标数据",
  "/honors": "荣誉资质追踪",
  "/members": "会员管理",
  "/activities": "协会活动",
  "/risk": "企业风险预警",
  "/policies": "政策兑现追踪",
  "/reports": "报告中心",
  "/crawler": "数据采集任务",
  "/system": "系统设置",
};

export function AppHeader() {
  const { pathname } = useLocation();
  const title = Object.entries(titleMap).find(([k]) => k === pathname || (k !== "/" && pathname.startsWith(k)))?.[1] || "数据管理平台";

  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="flex h-14 items-center gap-4 px-6">
        <div className="flex-1">
          <h1 className="text-base font-semibold text-foreground">{title}</h1>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 h-9 w-72 rounded-md border border-input bg-secondary/50 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          <span>搜索企业、信用代码…</span>
          <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded border border-border bg-background">⌘K</kbd>
        </div>
        <Link to="/cockpit" className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Maximize2 className="h-3.5 w-3.5" /> 大屏模式
        </Link>
        <button className="relative h-9 w-9 rounded-md hover:bg-accent flex items-center justify-center transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-medium">李</div>
          <div className="hidden md:block leading-tight">
            <div className="text-xs font-medium">李秘书</div>
            <div className="text-[10px] text-muted-foreground">协会管理员</div>
          </div>
        </div>
      </div>
    </header>
  );
}
