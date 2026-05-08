import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { enterprises, tenders, activities } from "@/lib/mock-data";
import { ArrowLeft, Crown, Award, AlertTriangle, Building2, MapPin, Users, Globe, Calendar } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
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

  return (
    <AppShell>
      <Link to="/enterprises" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> 返回企业列表
      </Link>

      <div className="bg-gradient-navy text-navy-foreground rounded-lg p-6 mb-4 shadow-elevated">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-lg bg-gradient-primary flex items-center justify-center text-2xl font-bold shadow-elevated">{e.name.slice(0, 2)}</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold">{e.name}</h1>
                {e.memberLevel !== "非会员" && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-warning/20 text-warning"><Crown className="h-3 w-3" />{e.memberLevel}</span>}
                {e.isListed && <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-info/20 text-info">上市 · {e.stockCode}</span>}
                {e.riskLevel !== "无" && <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium", e.riskLevel === "红" && "bg-destructive/30 text-destructive-foreground", e.riskLevel === "橙" && "bg-warning/30 text-warning-foreground", e.riskLevel === "黄" && "bg-warning/20 text-warning-foreground")}><AlertTriangle className="h-3 w-3" />{e.riskLevel}级风险</span>}
              </div>
              <div className="text-sm opacity-70 mt-1">{e.creditCode} · 成立于 {e.foundDate}</div>
              <div className="flex flex-wrap gap-3 mt-3 text-xs opacity-80">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{e.district} · {e.address}</span>
                <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />法人：{e.legalRep} · 员工{e.employees}人</span>
                {e.website && <span className="inline-flex items-center gap-1"><Globe className="h-3 w-3" />{e.website}</span>}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><div className="text-2xl font-bold tabular-nums">{(e.revenue[4].value / 10000).toFixed(2)}</div><div className="text-[11px] opacity-60">2024营收(亿)</div></div>
            {e.marketCap && <div><div className="text-2xl font-bold tabular-nums">{(e.marketCap / 10000).toFixed(0)}</div><div className="text-[11px] opacity-60">市值(亿)</div></div>}
            <div><div className="text-2xl font-bold tabular-nums">{e.patentCount}</div><div className="text-[11px] opacity-60">专利数</div></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5 shadow-card">
          <h3 className="text-sm font-semibold mb-3">近5年营收 / 利润趋势</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={e.revenue} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 250)" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke="oklch(0.55 0.18 252)" strokeWidth={2.5} name="营收(万元)" />
              <Line type="monotone" dataKey="profit" stroke="oklch(0.62 0.15 155)" strokeWidth={2.5} name="净利润(万元)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 shadow-card">
          <h3 className="text-sm font-semibold mb-3">企业荣誉资质</h3>
          {e.honors.length === 0 ? (
            <div className="text-sm text-muted-foreground">暂无荣誉资质数据</div>
          ) : (
            <div className="space-y-2">
              {e.honors.map((h) => (
                <div key={h} className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary/60">
                  <Award className="h-4 w-4 text-warning" />
                  <span className="text-sm">{h}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground space-y-1">
            <div>注册资本：{e.registeredCapital.toLocaleString()} 万元</div>
            <div>研发投入：{e.rdInvest?.toLocaleString()} 万元 ({e.rdInvest && e.revenue[4].value ? ((e.rdInvest / e.revenue[4].value) * 100).toFixed(1) : 0}%)</div>
            <div>产业链环节：{e.chainLayer}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-card border border-border rounded-lg p-5 shadow-card">
          <h3 className="text-sm font-semibold mb-3">招投标年度统计</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={tenderByYear}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="amount" fill="oklch(0.55 0.18 252)" name="中标金额(万)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 shadow-card">
          <h3 className="text-sm font-semibold mb-3">企业简介</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{e.intro}</p>
          <h4 className="text-xs font-semibold mt-4 mb-2 text-foreground">所属行业</h4>
          <div className="flex flex-wrap gap-1.5">
            {e.industries.map((i) => <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-primary/10 text-primary">{i}</span>)}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-card mb-4">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">招投标记录 ({ents.length})</h3>
          <button className="text-xs text-primary hover:underline">导出Excel</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2">项目名称</th>
                <th className="text-left px-4 py-2">招标方</th>
                <th className="text-left px-4 py-2">类型</th>
                <th className="text-right px-4 py-2">金额(万)</th>
                <th className="text-left px-4 py-2">日期</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ents.slice(0, 8).map((t) => (
                <tr key={t.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-2">{t.projectName}</td>
                  <td className="px-4 py-2 text-muted-foreground">{t.tenderee}</td>
                  <td className="px-4 py-2"><span className="text-[11px] px-1.5 py-0.5 rounded bg-muted">{t.projectType}</span></td>
                  <td className="px-4 py-2 text-right tabular-nums">{t.amount.toLocaleString()}</td>
                  <td className="px-4 py-2 text-muted-foreground">{t.date}</td>
                </tr>
              ))}
              {ents.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-muted-foreground">暂无招投标记录</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-5 shadow-card">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Calendar className="h-4 w-4" />参与协会活动 ({acts.length})</h3>
        {acts.length === 0 ? <div className="text-sm text-muted-foreground">该企业暂未参与协会活动记录</div> : (
          <div className="space-y-2">
            {acts.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between px-3 py-2 rounded-md bg-secondary/40">
                <div>
                  <div className="text-sm font-medium">{a.name}</div>
                  <div className="text-[11px] text-muted-foreground">{a.date} · {a.location}</div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-info/15 text-info">{a.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
