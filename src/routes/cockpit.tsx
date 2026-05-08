import { createFileRoute, Link } from "@tanstack/react-router";
import { stats, enterprises, yearTrend, industryDistribution, districtDistribution, tenders } from "@/lib/mock-data";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { ArrowLeft, Building2, Crown, TrendingUp, Award, MapPin, Activity } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/cockpit")({ component: Cockpit });

const COLORS = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

function PanelTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
        <span className="w-1 h-3.5 bg-cyan-400 rounded-sm" />{title}
      </h3>
      {hint && <span className="text-[10px] text-cyan-200/40">{hint}</span>}
    </div>
  );
}

function MetricBox({ label, value, unit, sub }: { label: string; value: string | number; unit?: string; sub?: string }) {
  return (
    <div className="px-3 py-2 rounded border border-cyan-400/20 bg-gradient-to-b from-cyan-500/10 to-transparent">
      <div className="text-[10px] text-cyan-200/60">{label}</div>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span className="text-xl font-bold text-cyan-100 tabular-nums">{value}</span>
        {unit && <span className="text-[10px] text-cyan-300/60">{unit}</span>}
      </div>
      {sub && <div className="text-[9px] text-emerald-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function Cockpit() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const top10Tender = (() => {
    const map = new Map<string, number>();
    tenders.filter((t) => t.year === 2024).forEach((t) => map.set(t.enterpriseName, (map.get(t.enterpriseName) || 0) + t.amount));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, amount]) => ({ name: name.replace("股份有限公司", ""), amount }));
  })();

  const topRev = enterprises.slice().sort((a, b) => b.revenue[4].value - a.revenue[4].value).slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-cockpit text-cyan-100 overflow-hidden relative">
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(0,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.5) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* Header */}
      <div className="relative px-8 pt-5 pb-3">
        <Link to="/" className="absolute left-6 top-6 inline-flex items-center gap-1 text-xs text-cyan-300/70 hover:text-cyan-200">
          <ArrowLeft className="h-3.5 w-3.5" />退出大屏
        </Link>
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-200 via-blue-300 to-cyan-200 bg-clip-text text-transparent tracking-wider">
            信息产业协会 · 数据驾驶舱
          </h1>
          <div className="text-xs text-cyan-300/50 mt-1 tracking-widest">INFORMATION INDUSTRY ASSOCIATION DATA COCKPIT</div>
        </div>
        <div className="absolute right-6 top-6 text-right">
          <div className="text-cyan-200 text-sm tabular-nums">{time.toLocaleString("zh-CN")}</div>
          <div className="text-[10px] text-cyan-300/50 mt-0.5">数据实时同步</div>
        </div>
      </div>

      {/* Top KPI bar */}
      <div className="relative px-6 pb-4">
        <div className="grid grid-cols-6 gap-3">
          {[
            { l: "入库企业总数", v: stats.totalEnterprises, u: "家", s: "本年新增 +12" },
            { l: "在册会员", v: stats.memberCount, u: "家", s: "↑ 3.1%" },
            { l: "产业总营收", v: (stats.totalRevenue / 100000000).toFixed(1), u: "千亿", s: "↑ 12.4%" },
            { l: "上市企业", v: stats.listedCount, u: "家", s: "市值 " + (stats.totalMarketCap / 10000).toFixed(0) + "亿" },
            { l: "本年中标金额", v: (stats.yearTenderAmount / 10000).toFixed(2), u: "亿", s: "↑ 18.6%" },
            { l: "本年中标项目", v: stats.yearTenderCount, u: "个", s: "覆盖 " + new Set(tenders.filter((t) => t.year === 2024).map((t) => t.enterpriseId)).size + " 家" },
          ].map((m) => <MetricBox key={m.l} label={m.l} value={m.v} unit={m.u} sub={m.s} />)}
        </div>
      </div>

      {/* Main Grid */}
      <div className="relative px-6 pb-6 grid grid-cols-12 gap-3" style={{ height: "calc(100vh - 220px)" }}>
        {/* Left column */}
        <div className="col-span-3 flex flex-col gap-3">
          <div className="flex-1 rounded border border-cyan-400/20 bg-gradient-to-b from-cyan-950/40 to-blue-950/20 p-3">
            <PanelTitle title="行业结构分布" hint="单位: 家" />
            <ResponsiveContainer width="100%" height="92%">
              <PieChart>
                <Pie data={industryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} label={{ fill: "#7dd3fc", fontSize: 10 }}>
                  {industryDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#0c1f3d", border: "1px solid #155e75", borderRadius: 4, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 rounded border border-cyan-400/20 bg-gradient-to-b from-cyan-950/40 to-blue-950/20 p-3">
            <PanelTitle title="企业规模结构" />
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={["大型", "中型", "小型", "微型"].map((s) => ({ name: s, count: enterprises.filter((e) => e.scale === s).length }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#155e75" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#7dd3fc" }} />
                <YAxis tick={{ fontSize: 10, fill: "#7dd3fc" }} />
                <Tooltip contentStyle={{ background: "#0c1f3d", border: "1px solid #155e75", fontSize: 11 }} />
                <Bar dataKey="count" fill="url(#barG)" />
                <defs><linearGradient id="barG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#0e7490" /></linearGradient></defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 rounded border border-cyan-400/20 bg-gradient-to-b from-cyan-950/40 to-blue-950/20 p-3">
            <PanelTitle title="各区企业数量 TOP" />
            <div className="space-y-1.5 mt-2">
              {districtDistribution.sort((a, b) => b.count - a.count).slice(0, 6).map((d, i) => {
                const max = Math.max(...districtDistribution.map((x) => x.count));
                return (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="w-4 text-center text-cyan-400 font-bold">{i + 1}</span>
                    <span className="w-14 text-cyan-100/80 truncate">{d.name}</span>
                    <div className="flex-1 h-3 bg-cyan-950/50 rounded-sm overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${(d.count / max) * 100}%` }} />
                    </div>
                    <span className="w-8 text-right tabular-nums text-cyan-200">{d.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center column */}
        <div className="col-span-6 flex flex-col gap-3">
          <div className="flex-1 rounded border border-cyan-400/20 bg-gradient-to-b from-cyan-950/40 to-blue-950/20 p-3 relative">
            <PanelTitle title="近5年产业营收规模趋势" hint="单位: 亿元" />
            <ResponsiveContainer width="100%" height="92%">
              <AreaChart data={yearTrend}>
                <defs>
                  <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#155e75" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#7dd3fc" }} />
                <YAxis tick={{ fontSize: 11, fill: "#7dd3fc" }} />
                <Tooltip contentStyle={{ background: "#0c1f3d", border: "1px solid #155e75", fontSize: 11 }} />
                <Area type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={2.5} fill="url(#areaG)" />
                <Line type="monotone" dataKey="count" stroke="#fbbf24" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[42%] rounded border border-cyan-400/20 bg-gradient-to-b from-cyan-950/40 to-blue-950/20 p-3 relative overflow-hidden">
            <PanelTitle title="区域企业分布 · 模拟热力" />
            <div className="grid grid-cols-4 gap-2 h-[calc(100%-28px)]">
              {districtDistribution.map((d) => {
                const max = Math.max(...districtDistribution.map((x) => x.count));
                const heat = d.count / max;
                return (
                  <div key={d.name} className="rounded p-2 flex flex-col justify-between border border-cyan-400/30 relative overflow-hidden" style={{ background: `linear-gradient(135deg, rgba(34,211,238,${heat * 0.5}), rgba(59,130,246,${heat * 0.3}))` }}>
                    <div className="text-xs text-cyan-100 font-medium">{d.name}</div>
                    <div>
                      <div className="text-xl font-bold text-cyan-50 tabular-nums">{d.count}</div>
                      <div className="text-[10px] text-cyan-200/60">家企业</div>
                    </div>
                    <MapPin className="absolute right-1.5 top-1.5 h-3 w-3 text-cyan-300/40" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-3 flex flex-col gap-3">
          <div className="flex-1 rounded border border-cyan-400/20 bg-gradient-to-b from-cyan-950/40 to-blue-950/20 p-3">
            <PanelTitle title="2024中标金额 TOP8" hint="单位: 万元" />
            <ResponsiveContainer width="100%" height="92%">
              <BarChart data={top10Tender} layout="vertical" margin={{ left: 5, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#155e75" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: "#7dd3fc" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "#7dd3fc" }} width={50} />
                <Tooltip contentStyle={{ background: "#0c1f3d", border: "1px solid #155e75", fontSize: 11 }} />
                <Bar dataKey="amount" fill="url(#hbarG)" />
                <defs><linearGradient id="hbarG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0e7490" /><stop offset="100%" stopColor="#22d3ee" /></linearGradient></defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 rounded border border-cyan-400/20 bg-gradient-to-b from-cyan-950/40 to-blue-950/20 p-3">
            <PanelTitle title="营收 TOP 重点企业" />
            <div className="space-y-1.5 mt-2 text-xs">
              {topRev.map((e, i) => (
                <div key={e.id} className="flex items-center gap-2 px-2 py-1.5 rounded border border-cyan-400/10 bg-cyan-500/5">
                  <span className={`w-5 h-5 rounded text-[10px] flex items-center justify-center font-bold ${i < 3 ? "bg-amber-500/30 text-amber-200" : "bg-cyan-500/15 text-cyan-300"}`}>{i + 1}</span>
                  <span className="flex-1 truncate text-cyan-100/90">{e.name.replace("股份有限公司", "")}</span>
                  {e.memberLevel !== "非会员" && <Crown className="h-3 w-3 text-amber-300" />}
                  <span className="tabular-nums text-cyan-200 font-semibold">{(e.revenue[4].value / 10000).toFixed(1)}亿</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded border border-cyan-400/20 bg-gradient-to-b from-cyan-950/40 to-blue-950/20 p-3 h-[28%]">
            <PanelTitle title="实时动态" />
            <div className="space-y-1.5 mt-1 text-[11px] overflow-hidden">
              {[
                { i: Building2, t: "新增企业入库", c: "中科信息股份有限公司" },
                { i: TrendingUp, t: "中标信息更新", c: "智云数据 中标 1280万" },
                { i: Award, t: "高新认定", c: "鸿信科技 通过认定" },
                { i: Activity, t: "年报采集", c: "8家上市公司Q1财报已更新" },
              ].map((it, i) => {
                const Icon = it.i;
                return (
                  <div key={i} className="flex items-center gap-2 px-2 py-1 rounded bg-cyan-500/5">
                    <Icon className="h-3 w-3 text-cyan-400 shrink-0" />
                    <span className="text-cyan-300/70 shrink-0">{it.t}:</span>
                    <span className="text-cyan-100 truncate">{it.c}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
