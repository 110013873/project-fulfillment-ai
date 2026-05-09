import { createFileRoute, Link } from "@tanstack/react-router";
import { stats, enterprises, yearTrend, industryDistribution, districtDistribution, tenders } from "@/lib/mock-data";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar } from "recharts";
import { ArrowLeft, Building2, Crown, TrendingUp, Award, MapPin, Activity, Maximize2, Radio, Cpu, Zap, Database } from "lucide-react";
import { useEffect, useState, ReactNode } from "react";

export const Route = createFileRoute("/cockpit")({ component: Cockpit });

const COLORS = ["#22d3ee", "#3b82f6", "#10b981", "#f59e0b", "#a78bfa", "#ec4899", "#14b8a6", "#fbbf24"];

function Panel({ title, hint, children, className = "", icon: Icon }: { title: string; hint?: string; children: ReactNode; className?: string; icon?: typeof Cpu }) {
  return (
    <div className={`relative rounded-md border border-cyan-400/25 bg-gradient-to-b from-cyan-950/50 via-blue-950/30 to-transparent p-3 backdrop-blur-sm shadow-glow-cyan overflow-hidden ${className}`}>
      {/* corner brackets */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-300/80" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-300/80" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-300/80" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-300/80" />
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-[13px] font-semibold text-cyan-200 flex items-center gap-1.5 tracking-wide">
          {Icon ? <Icon className="h-3.5 w-3.5 text-cyan-300" /> : <span className="w-1 h-3.5 bg-gradient-to-b from-cyan-300 to-cyan-500 rounded-sm" />}
          {title}
        </h3>
        {hint && <span className="text-[10px] text-cyan-200/50 font-mono">{hint}</span>}
      </div>
      <div className="relative h-[calc(100%-26px)]">{children}</div>
    </div>
  );
}

function MetricBox({ label, value, unit, sub, icon: Icon }: { label: string; value: string | number; unit?: string; sub?: string; icon: typeof Cpu }) {
  return (
    <div className="relative px-3 py-2.5 rounded-md border border-cyan-400/30 bg-gradient-to-br from-cyan-500/15 via-blue-600/10 to-transparent overflow-hidden group hover:border-cyan-300/60 transition-all">
      <div className="absolute -right-3 -top-3 w-14 h-14 rounded-full bg-cyan-400/10 blur-xl group-hover:bg-cyan-400/25 transition" />
      <Icon className="absolute right-2 top-2 h-4 w-4 text-cyan-300/40" />
      <div className="text-[10px] text-cyan-200/70 tracking-wider uppercase">{label}</div>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-2xl font-bold text-cyan-50 tabular-nums text-glow-cyan">{value}</span>
        {unit && <span className="text-[11px] text-cyan-300/70">{unit}</span>}
      </div>
      {sub && <div className="text-[10px] text-emerald-300/90 mt-1 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />{sub}</div>}
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
  const completionData = [{ name: "完成率", value: 62.5, fill: "#22d3ee" }];

  const liveFeed = [
    { i: Building2, t: "新增企业入库", c: "中科信息股份有限公司", time: "2 min" },
    { i: TrendingUp, t: "中标信息更新", c: "智云数据 中标 1280万", time: "5 min" },
    { i: Award, t: "高新认定", c: "鸿信科技 通过认定", time: "12 min" },
    { i: Activity, t: "年报采集", c: "8家上市公司Q1财报已更新", time: "28 min" },
    { i: Database, t: "数据同步", c: "工商信息库 同步 248 条", time: "1 hr" },
    { i: Zap, t: "政策匹配", c: "P002 自动匹配 12 家企业", time: "2 hr" },
  ];

  const formatTime = (d: Date) => d.toLocaleTimeString("zh-CN", { hour12: false });
  const formatDate = (d: Date) => `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, "0")}月${String(d.getDate()).padStart(2, "0")}日 ${["日", "一", "二", "三", "四", "五", "六"][d.getDay()]}`;

  return (
    <div className="min-h-screen bg-gradient-cockpit text-cyan-100 overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-cyan opacity-60" />
      <div className="absolute inset-0 bg-radial-glow" />

      {/* Header */}
      <header className="relative px-6 pt-4 pb-3 border-b border-cyan-400/15">
        <Link to="/" className="absolute left-5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-cyan-400/30 text-xs text-cyan-200/80 hover:bg-cyan-400/10 hover:text-cyan-100 transition backdrop-blur-sm">
          <ArrowLeft className="h-3.5 w-3.5" />退出大屏
        </Link>
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-400/60" />
            <Radio className="h-4 w-4 text-cyan-300 pulse-dot" />
            <h1 className="text-[28px] font-bold tracking-[0.2em] bg-gradient-to-r from-cyan-100 via-blue-200 to-cyan-100 bg-clip-text text-transparent text-glow-cyan">
              信息产业协会 · 数据驾驶舱
            </h1>
            <Radio className="h-4 w-4 text-cyan-300 pulse-dot" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-400/60" />
          </div>
          <div className="text-[11px] text-cyan-300/50 mt-1 tracking-[0.4em] font-mono">INFORMATION INDUSTRY ASSOCIATION · REAL-TIME DATA COCKPIT</div>
        </div>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-right">
          <div className="text-cyan-100 text-lg font-mono tabular-nums tracking-wider text-glow-cyan">{formatTime(time)}</div>
          <div className="text-[10px] text-cyan-300/60 mt-0.5">{formatDate(time)}</div>
        </div>
      </header>

      {/* Top KPI bar */}
      <div className="relative px-5 py-3">
        <div className="grid grid-cols-6 gap-2.5">
          <MetricBox label="入库企业总数" value={stats.totalEnterprises} unit="家" sub="本年新增 +12" icon={Building2} />
          <MetricBox label="在册会员单位" value={stats.memberCount} unit="家" sub="↑ 3.1%" icon={Crown} />
          <MetricBox label="产业总营收" value={(stats.totalRevenue / 100000000).toFixed(1)} unit="千亿" sub="↑ 12.4%" icon={TrendingUp} />
          <MetricBox label="上市企业数量" value={stats.listedCount} unit="家" sub={`市值 ${(stats.totalMarketCap / 10000).toFixed(0)} 亿`} icon={Award} />
          <MetricBox label="本年中标金额" value={(stats.yearTenderAmount / 10000).toFixed(2)} unit="亿" sub="↑ 18.6%" icon={Zap} />
          <MetricBox label="本年中标项目" value={stats.yearTenderCount} unit="个" sub={`覆盖 ${new Set(tenders.filter((t) => t.year === 2024).map((t) => t.enterpriseId)).size} 家`} icon={Cpu} />
        </div>
      </div>

      {/* Main Grid */}
      <div className="relative px-5 pb-5 grid grid-cols-12 gap-2.5" style={{ height: "calc(100vh - 200px)" }}>
        {/* Left column */}
        <div className="col-span-3 flex flex-col gap-2.5">
          <Panel title="行业结构分布" hint="UNIT: 家" icon={Cpu} className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={industryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={70} paddingAngle={3} stroke="#0c1f3d" strokeWidth={2}>
                  {industryDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(12,31,61,.95)", border: "1px solid #22d3ee", borderRadius: 4, fontSize: 11, color: "#e0f2fe" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute right-1 top-7 space-y-1 text-[10px]">
              {industryDistribution.slice(0, 6).map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-cyan-200/80 truncate max-w-[80px]">{d.name}</span>
                  <span className="text-cyan-300 font-semibold tabular-nums">{d.value}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="企业规模结构" icon={Database} className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={["大型", "中型", "小型", "微型"].map((s) => ({ name: s, count: enterprises.filter((e) => e.scale === s).length }))} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,211,238,.15)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#7dd3fc" }} axisLine={{ stroke: "rgba(34,211,238,.3)" }} />
                <YAxis tick={{ fontSize: 10, fill: "#7dd3fc" }} axisLine={{ stroke: "rgba(34,211,238,.3)" }} />
                <Tooltip contentStyle={{ background: "rgba(12,31,61,.95)", border: "1px solid #22d3ee", borderRadius: 4, fontSize: 11, color: "#e0f2fe" }} cursor={{ fill: "rgba(34,211,238,.08)" }} />
                <Bar dataKey="count" fill="url(#barG)" radius={[4, 4, 0, 0]} />
                <defs><linearGradient id="barG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#67e8f9" /><stop offset="100%" stopColor="#0e7490" stopOpacity={0.4} /></linearGradient></defs>
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="各区企业数量 TOP" icon={MapPin} className="flex-1">
            <div className="space-y-2 mt-1">
              {districtDistribution.slice().sort((a, b) => b.count - a.count).slice(0, 6).map((d, i) => {
                const max = Math.max(...districtDistribution.map((x) => x.count));
                return (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className={`w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded ${i === 0 ? "bg-amber-400/30 text-amber-200" : i === 1 ? "bg-slate-300/20 text-slate-200" : i === 2 ? "bg-orange-500/25 text-orange-200" : "bg-cyan-500/15 text-cyan-300"}`}>{i + 1}</span>
                    <span className="w-14 text-cyan-100/85 truncate">{d.name}</span>
                    <div className="flex-1 h-3 bg-cyan-950/60 rounded-sm overflow-hidden border border-cyan-400/10">
                      <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500 shadow-glow-cyan" style={{ width: `${(d.count / max) * 100}%` }} />
                    </div>
                    <span className="w-8 text-right tabular-nums text-cyan-100 font-semibold">{d.count}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        {/* Center column */}
        <div className="col-span-6 flex flex-col gap-2.5">
          <Panel title="近5年产业营收规模趋势" hint="UNIT: 亿元 / 家" icon={TrendingUp} className="flex-1 scanline">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yearTrend} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="areaG2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,211,238,.15)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#7dd3fc" }} axisLine={{ stroke: "rgba(34,211,238,.3)" }} />
                <YAxis tick={{ fontSize: 11, fill: "#7dd3fc" }} axisLine={{ stroke: "rgba(34,211,238,.3)" }} />
                <Tooltip contentStyle={{ background: "rgba(12,31,61,.95)", border: "1px solid #22d3ee", borderRadius: 4, fontSize: 11, color: "#e0f2fe" }} />
                <Area type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={2.5} fill="url(#areaG)" name="营收(亿)" />
                <Area type="monotone" dataKey="count" stroke="#fbbf24" strokeWidth={2} fill="url(#areaG2)" name="企业数(家)" />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          <div className="grid grid-cols-3 gap-2.5 h-[44%]">
            <Panel title="年度KPI完成率" icon={Maximize2} className="col-span-1">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="60%" outerRadius="100%" data={completionData} startAngle={210} endAngle={-30}>
                  <RadialBar dataKey="value" cornerRadius={10} fill="#22d3ee" background={{ fill: "rgba(34,211,238,.08)" }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-3xl font-bold text-cyan-100 tabular-nums text-glow-cyan">62.5<span className="text-base text-cyan-300/70">%</span></div>
                <div className="text-[10px] text-cyan-300/70 mt-1">综合完成率</div>
                <div className="text-[10px] text-emerald-300/80 mt-0.5">优于去年 +4.2%</div>
              </div>
            </Panel>

            <Panel title="区域企业分布 · 热力" icon={MapPin} className="col-span-2">
              <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-full">
                {districtDistribution.map((d) => {
                  const max = Math.max(...districtDistribution.map((x) => x.count));
                  const heat = d.count / max;
                  return (
                    <div key={d.name} className="rounded p-2 flex flex-col justify-between border border-cyan-400/30 relative overflow-hidden hover:border-cyan-300 transition" style={{ background: `linear-gradient(135deg, rgba(34,211,238,${heat * 0.55}), rgba(59,130,246,${heat * 0.35}))` }}>
                      <div className="text-[11px] text-cyan-50 font-medium flex items-center gap-1"><MapPin className="h-2.5 w-2.5 text-cyan-300/70" />{d.name}</div>
                      <div>
                        <div className="text-lg font-bold text-cyan-50 tabular-nums text-glow-cyan">{d.count}</div>
                        <div className="text-[9px] text-cyan-200/70">家企业 · {(heat * 100).toFixed(0)}%</div>
                      </div>
                      <div className="absolute right-0 top-0 w-8 h-8 bg-cyan-300/10 rounded-bl-full" />
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-3 flex flex-col gap-2.5">
          <Panel title="2024中标金额 TOP8" hint="UNIT: 万元" icon={Zap} className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10Tender} layout="vertical" margin={{ top: 5, right: 15, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,211,238,.15)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: "#7dd3fc" }} axisLine={{ stroke: "rgba(34,211,238,.3)" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#7dd3fc" }} width={56} axisLine={{ stroke: "rgba(34,211,238,.3)" }} />
                <Tooltip contentStyle={{ background: "rgba(12,31,61,.95)", border: "1px solid #22d3ee", borderRadius: 4, fontSize: 11, color: "#e0f2fe" }} cursor={{ fill: "rgba(34,211,238,.08)" }} />
                <Bar dataKey="amount" fill="url(#hbarG)" radius={[0, 4, 4, 0]} />
                <defs><linearGradient id="hbarG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0e7490" stopOpacity={0.4} /><stop offset="100%" stopColor="#67e8f9" /></linearGradient></defs>
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="营收 TOP 重点企业" icon={Award} className="flex-1">
            <div className="space-y-1.5 mt-1 text-xs">
              {topRev.map((e, i) => (
                <div key={e.id} className="flex items-center gap-2 px-2 py-1.5 rounded border border-cyan-400/15 bg-gradient-to-r from-cyan-500/10 to-transparent hover:border-cyan-300/40 transition">
                  <span className={`w-5 h-5 rounded text-[10px] flex items-center justify-center font-bold ${i === 0 ? "bg-amber-400/35 text-amber-100" : i === 1 ? "bg-slate-300/25 text-slate-100" : i === 2 ? "bg-orange-500/30 text-orange-100" : "bg-cyan-500/20 text-cyan-200"}`}>{i + 1}</span>
                  <span className="flex-1 truncate text-cyan-50/95">{e.name.replace("股份有限公司", "")}</span>
                  {e.memberLevel !== "非会员" && <Crown className="h-3 w-3 text-amber-300" />}
                  <span className="tabular-nums text-cyan-100 font-semibold text-glow-cyan">{(e.revenue[4].value / 10000).toFixed(1)}<span className="text-[9px] text-cyan-300/70 ml-0.5">亿</span></span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="实时数据动态" hint="LIVE" icon={Radio} className="h-[28%]">
            <div className="absolute top-1 right-12 flex items-center gap-1 text-[9px] text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />实时
            </div>
            <div className="h-full overflow-hidden relative -mt-1">
              <div className="animate-marquee-y">
                <div>
                  {[...liveFeed, ...liveFeed].map((it, i) => {
                    const Icon = it.i;
                    return (
                      <div key={i} className="flex items-center gap-2 px-2 py-1.5 mb-1 rounded border border-cyan-400/10 bg-cyan-500/5 text-[11px]">
                        <Icon className="h-3 w-3 text-cyan-300 shrink-0" />
                        <span className="text-cyan-300/70 shrink-0">{it.t}</span>
                        <span className="text-cyan-50 truncate flex-1">{it.c}</span>
                        <span className="text-cyan-400/50 text-[9px] shrink-0">{it.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
