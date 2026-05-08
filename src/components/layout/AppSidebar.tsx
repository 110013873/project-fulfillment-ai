import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard, Building2, Users, Trophy, FileText, Map, BarChart3, AlertTriangle,
  Scroll, FileBarChart, Calendar, Network, Database, Settings, ChevronRight, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavGroup {
  label: string;
  items: { to: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}

const navGroups: NavGroup[] = [
  {
    label: "驾驶舱",
    items: [
      { to: "/", label: "总览首页", icon: LayoutDashboard },
      { to: "/cockpit", label: "数据驾驶舱", icon: BarChart3 },
      { to: "/kpi", label: "产业KPI看板", icon: Activity },
      { to: "/map", label: "产业地图", icon: Map },
      { to: "/chain", label: "产业链图谱", icon: Network },
    ],
  },
  {
    label: "数据管理",
    items: [
      { to: "/enterprises", label: "企业信息库", icon: Building2 },
      { to: "/tenders", label: "招投标数据", icon: FileText },
      { to: "/honors", label: "荣誉资质", icon: Trophy },
    ],
  },
  {
    label: "协会运营",
    items: [
      { to: "/members", label: "会员管理", icon: Users },
      { to: "/activities", label: "协会活动", icon: Calendar },
    ],
  },
  {
    label: "决策支持",
    items: [
      { to: "/risk", label: "风险预警", icon: AlertTriangle },
      { to: "/policies", label: "政策兑现", icon: Scroll },
      { to: "/reports", label: "报告中心", icon: FileBarChart },
    ],
  },
  {
    label: "系统管理",
    items: [
      { to: "/crawler", label: "采集任务", icon: Database },
      { to: "/system", label: "系统设置", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <aside className="hidden lg:flex h-screen w-60 flex-col bg-sidebar text-sidebar-foreground sticky top-0 border-r border-sidebar-border">
      <div className="px-5 py-5 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-md bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold shadow-elevated">信</div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-sidebar-primary-foreground">信息产业协会</div>
            <div className="text-[11px] text-sidebar-foreground/60">数据管理平台</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navGroups.map((g) => (
          <div key={g.label}>
            <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">{g.label}</div>
            <div className="space-y-0.5">
              {g.items.map((item) => {
                const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-primary-foreground font-medium"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-primary-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {active && <ChevronRight className="h-3.5 w-3.5" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-sidebar-border px-4 py-3 text-[11px] text-sidebar-foreground/50">
        v1.0 · 演示版本
      </div>
    </aside>
  );
}
