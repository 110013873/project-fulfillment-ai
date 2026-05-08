import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { enterprises, districtDistribution } from "@/lib/mock-data";
import { useState, useMemo } from "react";
import { Crown, AlertTriangle, MapPin, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/map")({ component: MapPage });

function MapPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [layer, setLayer] = useState<"count" | "revenue">("count");
  const [memberOnly, setMemberOnly] = useState(false);

  const visible = useMemo(() => enterprises.filter((e) =>
    (!selectedDistrict || e.district === selectedDistrict) &&
    (!memberOnly || e.memberLevel !== "非会员"),
  ), [selectedDistrict, memberOnly]);

  const max = Math.max(...districtDistribution.map((d) => layer === "count" ? d.count : d.revenue));

  return (
    <AppShell>
      <PageHeader title="产业地图" subtitle="区域分布热力图 + 企业坐标标注 (演示版地图，可对接天地图/高德地图)" />

      <div className="grid grid-cols-12 gap-4">
        {/* Left filter panel */}
        <div className="col-span-3 space-y-4">
          <div className="bg-card border border-border rounded-lg p-4 shadow-card">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Layers className="h-4 w-4" />图层控制</h3>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2"><input type="radio" checked={layer === "count"} onChange={() => setLayer("count")} />按企业数量</label>
              <label className="flex items-center gap-2"><input type="radio" checked={layer === "revenue"} onChange={() => setLayer("revenue")} />按营收规模</label>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={memberOnly} onChange={(e) => setMemberOnly(e.target.checked)} />仅显示会员单位</label>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 shadow-card">
            <h3 className="text-sm font-semibold mb-3">区域排名</h3>
            <div className="space-y-2">
              {districtDistribution.sort((a, b) => (layer === "count" ? b.count - a.count : b.revenue - a.revenue)).map((d) => {
                const v = layer === "count" ? d.count : d.revenue;
                const pct = (v / max) * 100;
                return (
                  <button key={d.name} onClick={() => setSelectedDistrict(selectedDistrict === d.name ? null : d.name)} className={cn(
                    "w-full text-left px-3 py-2 rounded border transition-all",
                    selectedDistrict === d.name ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/50",
                  )}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium">{d.name}</span>
                      <span className="tabular-nums text-muted-foreground">{layer === "count" ? `${d.count} 家` : `${(d.revenue / 10000).toFixed(1)} 亿`}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-gradient-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Map area */}
        <div className="col-span-9">
          <div className="relative bg-gradient-to-br from-slate-900 to-blue-950 rounded-lg overflow-hidden shadow-elevated" style={{ height: 620 }}>
            {/* SVG-based fake map */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(34,211,238,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.5) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded bg-background/80 backdrop-blur text-xs font-medium border border-border">
              <MapPin className="inline h-3 w-3 mr-1" />郑州市行政区划示意 · 共显示 {visible.length} 家企业
            </div>

            {/* Districts as colored zones */}
            <svg viewBox="0 0 800 600" className="w-full h-full">
              {districtDistribution.map((d, i) => {
                const cx = 100 + (i % 4) * 180;
                const cy = 130 + Math.floor(i / 4) * 200;
                const heat = layer === "count" ? d.count / max : d.revenue / max;
                const selected = selectedDistrict === d.name;
                return (
                  <g key={d.name}>
                    <rect x={cx - 80} y={cy - 80} width={160} height={160} rx={12}
                      fill={`rgba(59,130,246,${heat * 0.6})`} stroke={selected ? "#22d3ee" : "rgba(34,211,238,0.3)"} strokeWidth={selected ? 2.5 : 1}
                      onClick={() => setSelectedDistrict(selectedDistrict === d.name ? null : d.name)}
                      style={{ cursor: "pointer" }} />
                    <text x={cx} y={cy - 10} textAnchor="middle" fill="#e0f2fe" fontSize="14" fontWeight="600">{d.name}</text>
                    <text x={cx} y={cy + 14} textAnchor="middle" fill="#7dd3fc" fontSize="20" fontWeight="700" className="tabular-nums">
                      {layer === "count" ? d.count : (d.revenue / 10000).toFixed(1)}
                    </text>
                    <text x={cx} y={cy + 30} textAnchor="middle" fill="#7dd3fc" opacity="0.7" fontSize="9">
                      {layer === "count" ? "家企业" : "亿元营收"}
                    </text>
                  </g>
                );
              })}

              {/* Enterprise dots */}
              {visible.slice(0, 60).map((e) => {
                const districtIdx = districtDistribution.findIndex((d) => d.name === e.district);
                const baseX = 100 + (districtIdx % 4) * 180;
                const baseY = 130 + Math.floor(districtIdx / 4) * 200;
                const x = baseX + (Math.random() - 0.5) * 130;
                const y = baseY + (Math.random() - 0.5) * 130;
                return <circle key={e.id} cx={x} cy={y} r={e.isListed ? 5 : 3} fill={e.memberLevel !== "非会员" ? "#fbbf24" : "#22d3ee"} opacity="0.9" />;
              })}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur rounded p-3 text-xs space-y-1.5 border border-border">
              <div className="font-semibold mb-1">图例</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400" />会员企业</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-cyan-400" />普通企业</div>
              <div className="flex items-center gap-2"><span className="w-4 h-1.5 bg-blue-500/60 rounded" />热力强度</div>
            </div>
          </div>

          {/* Selected enterprise list */}
          {selectedDistrict && (
            <div className="mt-4 bg-card border border-border rounded-lg shadow-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold">{selectedDistrict} · {visible.length} 家企业</h3>
                <button onClick={() => setSelectedDistrict(null)} className="text-xs text-muted-foreground hover:text-foreground">清除筛选</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
                {visible.slice(0, 8).map((e) => (
                  <div key={e.id} className="bg-card p-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-gradient-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">{e.name.slice(0, 2)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate flex items-center gap-1">{e.name}{e.memberLevel !== "非会员" && <Crown className="h-3 w-3 text-warning" />}</div>
                      <div className="text-[11px] text-muted-foreground">{e.industries[0]} · {e.scale} · {(e.revenue[4].value / 10000).toFixed(2)}亿</div>
                    </div>
                    {e.riskLevel !== "无" && <AlertTriangle className="h-3 w-3 text-warning" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
