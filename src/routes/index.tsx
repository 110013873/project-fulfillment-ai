import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { StatCard } from "@/components/StatCard";
import { stats, enterprises, activities, reports, yearTrend, industryDistribution } from "@/lib/mock-data";
import { Building2, Users, TrendingUp, Award, FileText, AlertTriangle, ArrowRight, Crown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid } from "recharts";

export const Route = createFileRoute("/")({ component: Home });

const COLORS = ["oklch(0.55 0.18 252)", "oklch(0.65 0.13 200)", "oklch(0.62 0.15 155)", "oklch(0.74 0.16 70)", "oklch(0.6 0.22 27)", "oklch(0.6 0.18 290)", "oklch(0.7 0.15 30)", "oklch(0.5 0.15 180)"];

function Home() {
  const recentEnts = enterprises.filter((e) => e.status === "已发布").slice(0, 6);
  const recentActs = activities.filter((a) => a.status === "已举办").slice(0, 4);

  return (
    <AppShell>
      <PageHeader
        title="平台总览"
        subtitle={`今日数据更新：${new Date().toLocaleDateString("zh-CN")} · 数据源覆盖 ${enterprises.length} 家企业`}
        actions={
          <Link to="/cockpit" className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            进入大屏驾驶舱 <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard label="入库企业" value={stats.totalEnterprises} unit="家" delta={5.4} hint="本年新增12" icon={<Building2 className="h-4 w-4" />} variant="primary" />
        <StatCard label="在册会员" value={stats.memberCount} unit="家" delta={3.1} icon={<Users className="h-4 w-4" />} />
        <StatCard label="本年中标金额" value={(stats.yearTenderAmount / 10000).toFixed(2)} unit="亿元" delta={18.6} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="高新企业" value={stats.highTechCount} unit="家" delta={13} icon={<Award className="h-4 w-4" />} />
        <StatCard label="待审核" value={stats.pendingAudit} unit="条" hint="需要处理" icon={<FileText className="h-4 w-4" />} />
        <StatCard label="风险预警" value={stats.riskCount} unit="家" hint={`含红级 ${stats.redRiskCount}`} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">近5年产业营收趋势</h3>
            <div className="text-xs text-muted-foreground">单位：亿元</div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={yearTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.55 0.18 252)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.55 0.18 252)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 250)" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="oklch(0.5 0.02 256)" />
              <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0.02 256)" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.91 0.01 250)", fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="oklch(0.55 0.18 252)" strokeWidth={2.5} dot={{ r: 4, fill: "oklch(0.55 0.18 252)" }} fill="url(#g1)" name="营收(亿元)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 shadow-card">
          <h3 className="text-sm font-semibold mb-4">行业结构分布</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={industryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                {industryDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.91 0.01 250)", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {industryDistribution.slice(0, 6).map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-2 w-2 rounded-sm" style={{ background: COLORS[i] }} />
                <span className="truncate">{d.name}</span>
                <span className="ml-auto tabular-nums">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg shadow-card">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="text-sm font-semibold">重点会员动态</h3>
            <Link to="/enterprises" className="text-xs text-primary hover:underline">查看全部 →</Link>
          </div>
          <div className="divide-y divide-border">
            {recentEnts.map((e) => (
              <div key={e.id} className="px-5 py-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors">
                <div className="h-9 w-9 rounded-md bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0">{e.name.slice(0, 2)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium truncate">{e.name}</span>
                    {e.memberLevel !== "非会员" && <Crown className="h-3 w-3 text-warning shrink-0" />}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{e.district} · {e.industries[0]} · {e.scale}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold tabular-nums">{(e.revenue[4].value / 10000).toFixed(2)}亿</div>
                  <div className="text-[10px] text-muted-foreground">2024营收</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg shadow-card">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-sm font-semibold">近期协会活动</h3>
              <Link to="/activities" className="text-xs text-primary hover:underline">查看全部 →</Link>
            </div>
            <div className="divide-y divide-border">
              {recentActs.map((a) => (
                <div key={a.id} className="px-5 py-3">
                  <div className="text-sm font-medium">{a.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">{a.date} · {a.location} · 参与企业 {a.enterpriseIds.length} 家</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg shadow-card">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-sm font-semibold">最新报告</h3>
              <Link to="/reports" className="text-xs text-primary hover:underline">查看全部 →</Link>
            </div>
            <div className="divide-y divide-border">
              {reports.slice(0, 3).map((r) => (
                <div key={r.id} className="px-5 py-3">
                  <div className="text-sm font-medium">{r.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">{r.type} · {r.date} · {r.author}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
