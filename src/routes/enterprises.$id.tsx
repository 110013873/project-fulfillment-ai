import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { enterprises, tenders, activities, policies } from "@/lib/mock-data";
import { ArrowLeft, Crown, Award, AlertTriangle, MapPin, Users, Globe, Calendar, Building2, Phone, Mail, Edit, Download, Share2, Star, FileText, TrendingUp, Briefcase, Layers, BadgeCheck, Activity as ActivityIcon, ShieldAlert, Network, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/enterprises/$id")({
  component: EnterpriseDetail,
});

function EnterpriseDetail() {
  const { id } = Route.useParams();
  const e = enterprises.find((x) => x.id === id);
  if (!e) throw notFound();
  const ents = tenders.filter((t) => t.enterpriseId === e.id);
  const acts = activities.filter((a) => a.enterpriseIds.includes(e.id));

  const tenderByYear = [2022, 2023, 2024].map((y) => ({
    year: y,
    amount: Math.round(ents.filter((t) => t.year === y).reduce((s, t) => s + t.amount, 0)),
    count: ents.filter((t) => t.year === y).length,
  }));

  // 同行业其他企业（推荐）
  const similar = enterprises
    .filter((x) => x.id !== e.id && x.industries.some((i) => e.industries.includes(i)))
    .slice(0, 5);

  // 匹配政策
  const matchedPolicies = policies.slice(0, 3);

  // 健康度雷达
  const radarData = [
    { metric: "营收规模", value: Math.min(100, (e.revenue[4].value / 3000)) },
    { metric: "盈利能力", value: Math.min(100, Math.max(20, (e.revenue[4].profit / e.revenue[4].value) * 500 + 50)) },
    { metric: "研发投入", value: Math.min(100, ((e.rdInvest || 0) / e.revenue[4].value) * 800) },
    { metric: "荣誉资质", value: Math.min(100, e.honors.length * 25) },
    { metric: "市场活跃", value: Math.min(100, ents.length * 20) },
    { metric: "协会贡献", value: e.memberLevel === "会长单位" ? 100 : e.memberLevel === "副会长单位" ? 85 : e.memberLevel === "常务理事单位" ? 70 : e.memberLevel === "理事单位" ? 55 : e.memberLevel === "普通会员单位" ? 40 : 15 },
  ];

  // 变更记录（mock）
  const changeLog = [
    { date: "2025-04-12", user: "lisecretary", action: "更新", field: "2024年度营收数据", from: "—", to: `${(e.revenue[4].value / 10000).toFixed(2)} 亿` },
    { date: "2025-03-08", user: "wangzhang", action: "新增", field: "荣誉资质", from: "—", to: e.honors[0] || "高新技术企业" },
    { date: "2025-02-15", user: "admin", action: "修改", field: "会员等级", from: "理事单位", to: e.memberLevel },
    { date: "2024-12-20", user: "lisecretary", action: "审核通过", field: "企业基本信息", from: "待审核", to: "已发布" },
  ];

  // 联系人（mock）
  const contacts = [
    { name: e.legalRep, role: "法定代表人", phone: "139****8866", email: `legal@${e.name.slice(0, 4)}.com` },
    { name: "张总监", role: "对接人 / 总经办主任", phone: "138****1234", email: `office@${e.name.slice(0, 4)}.com` },
    { name: "李经理", role: "招投标负责人", phone: "186****5678", email: `bid@${e.name.slice(0, 4)}.com` },
  ];

  const profitMargin = ((e.revenue[4].profit / e.revenue[4].value) * 100).toFixed(2);
  const rdRatio = e.rdInvest ? ((e.rdInvest / e.revenue[4].value) * 100).toFixed(2) : "0";
  const yoyGrowth = (((e.revenue[4].value - e.revenue[3].value) / e.revenue[3].value) * 100).toFixed(1);

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-3">
        <Link to="/enterprises" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> 返回企业列表
        </Link>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-input text-xs hover:bg-accent"><Star className="h-3.5 w-3.5" />收藏</button>
          <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-input text-xs hover:bg-accent"><Share2 className="h-3.5 w-3.5" />分享</button>
          <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-input text-xs hover:bg-accent"><Download className="h-3.5 w-3.5" />导出企业档案</button>
          <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs hover:opacity-90"><Edit className="h-3.5 w-3.5" />编辑信息</button>
        </div>
      </div>

      {/* HERO */}
      <div className="relative bg-gradient-navy text-navy-foreground rounded-xl p-6 mb-4 shadow-elevated overflow-hidden">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-32 top-8 w-40 h-40 rounded-full bg-info/15 blur-2xl" />
        <div className="relative flex items-start justify-between gap-6 flex-wrap">
          <div className="flex items-start gap-5">
            <div className="h-20 w-20 rounded-xl bg-gradient-primary flex items-center justify-center text-3xl font-bold shadow-elevated ring-2 ring-white/10">{e.name.slice(0, 2)}</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{e.name}</h1>
                {e.memberLevel !== "非会员" && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-warning/25 text-warning border border-warning/30"><Crown className="h-3 w-3" />{e.memberLevel}</span>}
                {e.isListed && <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-info/20 text-info border border-info/30">上市 · {e.stockCode}</span>}
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-white/10 border border-white/15">{e.scale}企业</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-white/10 border border-white/15">{e.nature}</span>
                {e.riskLevel !== "无" && (
                  <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium",
                    e.riskLevel === "红" && "bg-destructive/35 text-destructive-foreground border border-destructive/40",
                    e.riskLevel === "橙" && "bg-warning/35 text-warning-foreground border border-warning/40",
                    e.riskLevel === "黄" && "bg-warning/20 text-warning-foreground border border-warning/25",
                  )}><AlertTriangle className="h-3 w-3" />{e.riskLevel}级风险</span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-success/20 text-success border border-success/30"><CheckCircle2 className="h-3 w-3" />{e.status}</span>
              </div>
              <div className="text-sm opacity-70 mt-2 font-mono">{e.creditCode}</div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs opacity-85">
                <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />成立 {e.foundDate}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{e.district} · {e.address}</span>
                <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />法人 {e.legalRep} · 员工 {e.employees}</span>
                {e.website && <span className="inline-flex items-center gap-1"><Globe className="h-3 w-3" />{e.website}</span>}
                <span className="inline-flex items-center gap-1"><Layers className="h-3 w-3" />产业链：{e.chainLayer}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {e.industries.map((i) => <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-primary/25 text-primary-foreground border border-primary/30">{i}</span>)}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 min-w-[420px]">
            {[
              { l: "2024营收", v: (e.revenue[4].value / 10000).toFixed(2), u: "亿元", s: `同比 ${Number(yoyGrowth) >= 0 ? "+" : ""}${yoyGrowth}%`, sUp: Number(yoyGrowth) >= 0 },
              { l: "净利率", v: profitMargin, u: "%", s: `${(e.revenue[4].profit / 10000).toFixed(2)} 亿` },
              ...(e.marketCap ? [{ l: "市值", v: (e.marketCap / 10000).toFixed(0), u: "亿元", s: `股票 ${e.stockCode}` }] : [{ l: "注册资本", v: e.registeredCapital.toLocaleString(), u: "万", s: e.nature }]),
              { l: "专利 / 研发", v: e.patentCount || 0, u: "件", s: `R&D ${rdRatio}%` },
            ].map((m) => (
              <div key={m.l} className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur">
                <div className="text-[10px] opacity-60 uppercase tracking-wider">{m.l}</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold tabular-nums">{m.v}</span>
                  <span className="text-[11px] opacity-60">{m.u}</span>
                </div>
                <div className={cn("text-[10px] mt-0.5", m.sUp === false ? "text-destructive-foreground" : m.sUp === true ? "text-success" : "opacity-60")}>{m.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* MAIN COLUMN */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-7 w-full bg-secondary/60 h-10">
              <TabsTrigger value="overview" className="text-xs"><Building2 className="h-3.5 w-3.5 mr-1" />概览</TabsTrigger>
              <TabsTrigger value="finance" className="text-xs"><TrendingUp className="h-3.5 w-3.5 mr-1" />经营财务</TabsTrigger>
              <TabsTrigger value="tender" className="text-xs"><Briefcase className="h-3.5 w-3.5 mr-1" />招投标</TabsTrigger>
              <TabsTrigger value="honor" className="text-xs"><BadgeCheck className="h-3.5 w-3.5 mr-1" />荣誉资质</TabsTrigger>
              <TabsTrigger value="risk" className="text-xs"><ShieldAlert className="h-3.5 w-3.5 mr-1" />风险</TabsTrigger>
              <TabsTrigger value="activity" className="text-xs"><ActivityIcon className="h-3.5 w-3.5 mr-1" />活动</TabsTrigger>
              <TabsTrigger value="log" className="text-xs"><FileText className="h-3.5 w-3.5 mr-1" />变更</TabsTrigger>
            </TabsList>

            {/* 概览 */}
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-lg p-5 shadow-card">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5"><Building2 className="h-4 w-4 text-primary" />企业简介</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{e.intro}</p>
                  <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div><span className="text-muted-foreground">注册资本：</span><span className="font-medium">{e.registeredCapital.toLocaleString()} 万元</span></div>
                    <div><span className="text-muted-foreground">企业性质：</span><span className="font-medium">{e.nature}</span></div>
                    <div><span className="text-muted-foreground">企业规模：</span><span className="font-medium">{e.scale}</span></div>
                    <div><span className="text-muted-foreground">员工人数：</span><span className="font-medium">{e.employees} 人</span></div>
                    <div><span className="text-muted-foreground">数据来源：</span><span className="font-medium">{e.source}</span></div>
                    <div><span className="text-muted-foreground">最近更新：</span><span className="font-medium">{e.updatedAt}</span></div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-5 shadow-card">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5"><Network className="h-4 w-4 text-primary" />企业健康度评估</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="oklch(0.91 0.01 250)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "oklch(0.5 0.02 256)" }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                      <Radar name="企业评分" dataKey="value" stroke="oklch(0.55 0.18 252)" fill="oklch(0.55 0.18 252)" fillOpacity={0.35} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="text-center text-xs text-muted-foreground -mt-2">综合评分：<span className="text-lg font-bold text-primary">{Math.round(radarData.reduce((s, d) => s + d.value, 0) / radarData.length)}</span> / 100</div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-5 shadow-card">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5"><Phone className="h-4 w-4 text-primary" />企业联系人</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {contacts.map((c) => (
                    <div key={c.name} className="border border-border rounded-md p-3 hover:border-primary/50 hover:shadow-card transition">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">{c.name.slice(0, 1)}</div>
                        <div>
                          <div className="text-sm font-medium">{c.name}</div>
                          <div className="text-[11px] text-muted-foreground">{c.role}</div>
                        </div>
                      </div>
                      <div className="mt-2.5 space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{c.phone}</div>
                        <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{c.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* 经营财务 */}
            <TabsContent value="finance" className="mt-4 space-y-4">
              <div className="bg-card border border-border rounded-lg p-5 shadow-card">
                <h3 className="text-sm font-semibold mb-3">近5年营收 / 利润 / 研发投入趋势</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={e.revenue.map((r) => ({ ...r, rd: Math.round(r.value * (Number(rdRatio) / 100)) }))} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 250)" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="value" stroke="oklch(0.55 0.18 252)" strokeWidth={2.5} name="营收(万元)" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="profit" stroke="oklch(0.62 0.15 155)" strokeWidth={2.5} name="净利润(万元)" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="rd" stroke="oklch(0.74 0.16 70)" strokeWidth={2} strokeDasharray="5 4" name="研发投入(万元)" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { l: "5年营收 CAGR", v: (((e.revenue[4].value / e.revenue[0].value) ** (1 / 4) - 1) * 100).toFixed(2) + "%", c: "text-primary" },
                  { l: "净利率", v: profitMargin + "%", c: Number(profitMargin) > 0 ? "text-success" : "text-destructive" },
                  { l: "研发强度", v: rdRatio + "%", c: "text-warning" },
                  { l: "人均产值", v: e.employees ? ((e.revenue[4].value / e.employees) / 10).toFixed(1) + " 万" : "—", c: "text-info" },
                ].map((m) => (
                  <div key={m.l} className="bg-card border border-border rounded-lg p-4 shadow-card">
                    <div className="text-xs text-muted-foreground">{m.l}</div>
                    <div className={cn("text-2xl font-bold tabular-nums mt-1", m.c)}>{m.v}</div>
                  </div>
                ))}
              </div>
              <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
                <div className="px-5 py-3 border-b border-border text-sm font-semibold">年度财务明细</div>
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60 text-xs text-muted-foreground">
                    <tr><th className="text-left px-4 py-2">年度</th><th className="text-right px-4 py-2">营业收入(万)</th><th className="text-right px-4 py-2">同比</th><th className="text-right px-4 py-2">净利润(万)</th><th className="text-right px-4 py-2">净利率</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {e.revenue.slice().reverse().map((r, i, arr) => {
                      const prev = arr[i + 1];
                      const yoy = prev ? (((r.value - prev.value) / prev.value) * 100).toFixed(1) : "—";
                      return (
                        <tr key={r.year} className="hover:bg-secondary/40">
                          <td className="px-4 py-2 font-medium">{r.year}</td>
                          <td className="px-4 py-2 text-right tabular-nums">{r.value.toLocaleString()}</td>
                          <td className={cn("px-4 py-2 text-right tabular-nums text-xs", Number(yoy) >= 0 ? "text-success" : "text-destructive")}>{yoy === "—" ? "—" : (Number(yoy) >= 0 ? "+" : "") + yoy + "%"}</td>
                          <td className="px-4 py-2 text-right tabular-nums">{r.profit.toLocaleString()}</td>
                          <td className="px-4 py-2 text-right tabular-nums text-xs text-muted-foreground">{((r.profit / r.value) * 100).toFixed(2)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* 招投标 */}
            <TabsContent value="tender" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-card border border-border rounded-lg p-4 shadow-card"><div className="text-xs text-muted-foreground">累计中标项目</div><div className="text-2xl font-bold tabular-nums mt-1 text-primary">{ents.length}</div></div>
                <div className="bg-card border border-border rounded-lg p-4 shadow-card"><div className="text-xs text-muted-foreground">累计中标金额</div><div className="text-2xl font-bold tabular-nums mt-1 text-primary">{(ents.reduce((s, t) => s + t.amount, 0) / 10000).toFixed(2)}<span className="text-sm ml-1 text-muted-foreground">亿</span></div></div>
                <div className="bg-card border border-border rounded-lg p-4 shadow-card"><div className="text-xs text-muted-foreground">2024年中标</div><div className="text-2xl font-bold tabular-nums mt-1 text-primary">{tenderByYear[2].count}<span className="text-sm ml-1 text-muted-foreground">项 · {(tenderByYear[2].amount / 10000).toFixed(2)} 亿</span></div></div>
              </div>
              <div className="bg-card border border-border rounded-lg p-5 shadow-card">
                <h3 className="text-sm font-semibold mb-3">招投标年度统计</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={tenderByYear}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="l" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar yAxisId="l" dataKey="amount" fill="oklch(0.55 0.18 252)" name="中标金额(万)" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="r" dataKey="count" fill="oklch(0.62 0.15 155)" name="项目数" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
                <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold">招投标记录 ({ents.length})</h3>
                  <button className="text-xs text-primary hover:underline">导出 Excel</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/60 text-xs text-muted-foreground">
                      <tr>
                        <th className="text-left px-4 py-2">项目名称</th>
                        <th className="text-left px-4 py-2">招标方</th>
                        <th className="text-left px-4 py-2">类型</th>
                        <th className="text-left px-4 py-2">角色</th>
                        <th className="text-right px-4 py-2">金额(万)</th>
                        <th className="text-left px-4 py-2">日期</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {ents.slice(0, 12).map((t) => (
                        <tr key={t.id} className="hover:bg-secondary/40">
                          <td className="px-4 py-2">{t.projectName}</td>
                          <td className="px-4 py-2 text-muted-foreground">{t.tenderee}</td>
                          <td className="px-4 py-2"><span className="text-[11px] px-1.5 py-0.5 rounded bg-muted">{t.projectType}</span></td>
                          <td className="px-4 py-2 text-xs text-muted-foreground">{t.role}</td>
                          <td className="px-4 py-2 text-right tabular-nums font-medium">{t.amount.toLocaleString()}</td>
                          <td className="px-4 py-2 text-muted-foreground">{t.date}</td>
                        </tr>
                      ))}
                      {ents.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-muted-foreground">暂无招投标记录</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* 荣誉资质 */}
            <TabsContent value="honor" className="mt-4">
              <div className="bg-card border border-border rounded-lg p-5 shadow-card">
                <h3 className="text-sm font-semibold mb-4">荣誉资质 ({e.honors.length})</h3>
                {e.honors.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-8 text-center">暂无荣誉资质数据，可在系统中录入。</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {e.honors.map((h, i) => (
                      <div key={h} className="flex items-start gap-3 p-3 rounded-lg border border-warning/30 bg-warning/5 hover:bg-warning/10 transition">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-warning to-warning/60 flex items-center justify-center shrink-0"><Award className="h-5 w-5 text-warning-foreground" /></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{h}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">认定时间：{2020 + i}年 · 有效期至 {2025 + i}年</div>
                          <div className="text-[11px] text-muted-foreground">颁发机构：{i % 2 === 0 ? "国家科技部" : "省工信厅"}</div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/15 text-success self-start">有效</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* 风险 */}
            <TabsContent value="risk" className="mt-4 space-y-4">
              <div className={cn("rounded-lg p-5 border-2",
                e.riskLevel === "红" && "bg-destructive/10 border-destructive/40",
                e.riskLevel === "橙" && "bg-warning/10 border-warning/40",
                e.riskLevel === "黄" && "bg-warning/5 border-warning/25",
                e.riskLevel === "无" && "bg-success/10 border-success/30",
              )}>
                <div className="flex items-center gap-3">
                  {e.riskLevel === "无" ? <CheckCircle2 className="h-8 w-8 text-success" /> : <AlertTriangle className="h-8 w-8 text-warning" />}
                  <div>
                    <div className="text-lg font-bold">{e.riskLevel === "无" ? "暂无风险" : `${e.riskLevel}级风险预警`}</div>
                    <div className="text-sm text-muted-foreground">{e.riskLevel === "无" ? "该企业当前所有风险维度均为正常" : `检测到 ${e.riskTypes.length} 项风险信号，建议关注`}</div>
                  </div>
                </div>
                {e.riskTypes.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {e.riskTypes.map((r) => <span key={r} className="px-2.5 py-1 rounded text-xs bg-card border border-border">{r}</span>)}
                  </div>
                )}
              </div>
              <div className="bg-card border border-border rounded-lg p-5 shadow-card">
                <h3 className="text-sm font-semibold mb-3">风险维度评估</h3>
                <div className="space-y-3">
                  {[
                    { name: "经营风险", level: e.revenue[4].profit < 0 ? "高" : "低", desc: e.revenue[4].profit < 0 ? "出现亏损" : "盈利稳定" },
                    { name: "司法风险", level: "低", desc: "未检测到失信、被执行记录" },
                    { name: "数据更新", level: "正常", desc: `最近更新于 ${e.updatedAt}` },
                    { name: "资质有效性", level: e.honors.length > 0 ? "正常" : "关注", desc: e.honors.length > 0 ? "所有荣誉资质均在有效期内" : "暂无荣誉资质记录" },
                  ].map((r) => (
                    <div key={r.name} className="flex items-center justify-between p-3 rounded-md bg-secondary/40">
                      <div>
                        <div className="text-sm font-medium">{r.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
                      </div>
                      <span className={cn("px-2 py-0.5 rounded text-xs font-medium",
                        r.level === "高" ? "bg-destructive/15 text-destructive" :
                        r.level === "中" ? "bg-warning/15 text-warning" :
                        r.level === "关注" ? "bg-warning/10 text-warning" :
                        "bg-success/15 text-success",
                      )}>{r.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* 活动 */}
            <TabsContent value="activity" className="mt-4">
              <div className="bg-card border border-border rounded-lg p-5 shadow-card">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />参与协会活动 ({acts.length})</h3>
                {acts.length === 0 ? <div className="text-sm text-muted-foreground py-8 text-center">该企业暂未参与协会活动记录</div> : (
                  <div className="relative pl-6 space-y-3">
                    <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
                    {acts.map((a) => (
                      <div key={a.id} className="relative">
                        <span className="absolute -left-[18px] top-2 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/15" />
                        <div className="flex items-center justify-between p-3 rounded-md border border-border hover:border-primary/40 hover:bg-secondary/40 transition">
                          <div>
                            <div className="text-sm font-medium">{a.name}</div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">{a.date} · {a.location} · {a.participants} 人参会</div>
                          </div>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-info/15 text-info">{a.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* 变更日志 */}
            <TabsContent value="log" className="mt-4">
              <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
                <div className="px-5 py-3 border-b border-border text-sm font-semibold">数据变更记录</div>
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60 text-xs text-muted-foreground">
                    <tr><th className="text-left px-4 py-2">时间</th><th className="text-left px-4 py-2">操作人</th><th className="text-left px-4 py-2">动作</th><th className="text-left px-4 py-2">字段</th><th className="text-left px-4 py-2">变更内容</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {changeLog.map((l, i) => (
                      <tr key={i} className="hover:bg-secondary/40">
                        <td className="px-4 py-2 text-muted-foreground tabular-nums text-xs">{l.date}</td>
                        <td className="px-4 py-2">{l.user}</td>
                        <td className="px-4 py-2"><span className="text-[11px] px-1.5 py-0.5 rounded bg-info/15 text-info">{l.action}</span></td>
                        <td className="px-4 py-2 text-muted-foreground">{l.field}</td>
                        <td className="px-4 py-2 text-xs"><span className="text-muted-foreground line-through">{l.from}</span> <ChevronRight className="inline h-3 w-3 text-muted-foreground" /> <span className="font-medium text-foreground">{l.to}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-4">
          {/* 匹配政策 */}
          <div className="bg-card border border-border rounded-lg p-4 shadow-card">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5"><FileText className="h-4 w-4 text-primary" />匹配政策 <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary ml-auto">{matchedPolicies.length}</span></h3>
            <div className="space-y-2">
              {matchedPolicies.map((p) => (
                <div key={p.id} className="p-2.5 rounded-md border border-border hover:border-primary/40 transition">
                  <div className="text-[13px] font-medium leading-snug">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-info/10 text-info text-[10px]">{p.type}</span>
                    <Clock className="h-3 w-3" />截止 {p.deadline}
                  </div>
                  <div className="text-[11px] text-success mt-1 truncate">{p.subsidy}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 同行业企业 */}
          <div className="bg-card border border-border rounded-lg p-4 shadow-card">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5"><Network className="h-4 w-4 text-primary" />同行业企业</h3>
            <div className="space-y-1">
              {similar.map((s) => (
                <Link key={s.id} to="/enterprises/$id" params={{ id: s.id }} className="flex items-center justify-between p-2 rounded hover:bg-secondary/60 transition group">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-7 w-7 rounded bg-gradient-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shrink-0">{s.name.slice(0, 2)}</div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate group-hover:text-primary">{s.name}</div>
                      <div className="text-[10px] text-muted-foreground">{s.district} · {s.scale}</div>
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* 数据完整度 */}
          <div className="bg-card border border-border rounded-lg p-4 shadow-card">
            <h3 className="text-sm font-semibold mb-3">数据完整度</h3>
            {(() => {
              const checks = [
                { l: "工商基本信息", ok: true },
                { l: "财务经营数据", ok: e.revenue.length === 5 },
                { l: "联系方式", ok: !!e.website },
                { l: "荣誉资质", ok: e.honors.length > 0 },
                { l: "招投标记录", ok: ents.length > 0 },
                { l: "活动参与", ok: acts.length > 0 },
              ];
              const done = checks.filter((c) => c.ok).length;
              const pct = Math.round((done / checks.length) * 100);
              return (
                <>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-2xl font-bold text-primary tabular-nums">{pct}<span className="text-sm">%</span></span>
                    <span className="text-xs text-muted-foreground">{done} / {checks.length}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden mb-3">
                    <div className="h-full bg-gradient-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {checks.map((c) => (
                      <div key={c.l} className="flex items-center gap-2">
                        {c.ok ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <Clock className="h-3.5 w-3.5 text-muted-foreground" />}
                        <span className={cn(c.ok ? "text-foreground" : "text-muted-foreground")}>{c.l}</span>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
