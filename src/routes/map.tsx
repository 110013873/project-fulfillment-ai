import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { enterprises, districtDistribution } from "@/lib/mock-data";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Crown, AlertTriangle, MapPin, Layers, ExternalLink, X,
  Building2, TrendingUp, Users, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MapContainer, TileLayer, CircleMarker, Popup, Polygon,
  Tooltip as LeafletTooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export const Route = createFileRoute("/map")({ component: MapPage });

/* ── 郑州市各区简化边界（[lng, lat] → 代码里再翻转成 Leaflet 的 [lat, lng]） ── */
const districtBoundaries: Record<string, [number, number][]> = {
  "高新区":    [[113.52,34.79],[113.58,34.82],[113.62,34.80],[113.60,34.76],[113.54,34.75]],
  "经开区":    [[113.72,34.70],[113.78,34.72],[113.80,34.68],[113.74,34.66]],
  "金水区":    [[113.65,34.78],[113.72,34.80],[113.74,34.76],[113.68,34.74]],
  "中原区":    [[113.58,34.76],[113.64,34.78],[113.66,34.74],[113.60,34.72]],
  "二七区":    [[113.62,34.72],[113.68,34.74],[113.66,34.70],[113.60,34.68]],
  "管城区":    [[113.68,34.74],[113.74,34.76],[113.76,34.72],[113.70,34.70]],
  "惠济区":    [[113.58,34.82],[113.66,34.84],[113.68,34.80],[113.60,34.78]],
  "郑东新区":  [[113.72,34.76],[113.80,34.78],[113.82,34.74],[113.74,34.72]],
};

const zhengzhouCenter: [number, number] = [34.75, 113.65];

/* ── 辅助：根据热力值生成颜色 ── */
function heatColor(heat: number, selected: boolean) {
  if (selected) return "#22d3ee";
  // heat 0→1 映射到 blue-cyan 渐变
  const h = 210 + heat * 30;   // 210 ~ 240
  const s = 60 + heat * 40;    // 60% ~ 100%
  const l = 50 + heat * 15;    // 50% ~ 65%
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function MapPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [layer, setLayer] = useState<"count" | "revenue">("count");
  const [memberOnly, setMemberOnly] = useState(false);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const visible = useMemo(
    () =>
      enterprises.filter(
        (e) =>
          (!selectedDistrict || e.district === selectedDistrict) &&
          (!memberOnly || e.memberLevel !== "非会员"),
      ),
    [selectedDistrict, memberOnly],
  );

  const max = Math.max(
    ...districtDistribution.map((d) =>
      layer === "count" ? d.count : d.revenue,
    ),
  );

  const stats = useMemo(() => {
    const totalRevenue = visible.reduce(
      (s, e) => s + e.revenue[4].value,
      0,
    );
    const memberCount = visible.filter(
      (e) => e.memberLevel !== "非会员",
    ).length;
    const listedCount = visible.filter((e) => e.isListed).length;
    const riskCount = visible.filter((e) => e.riskLevel !== "无").length;
    return { totalRevenue, memberCount, listedCount, riskCount };
  }, [visible]);

  const handleDistrictClick = useCallback(
    (name: string) => {
      setSelectedDistrict((prev) => {
        const next = prev === name ? null : name;
        setShowList(!!next);
        return next;
      });
    },
    [],
  );

  if (!mounted) {
    return (
      <AppShell>
        <PageHeader
          title="产业地图"
          subtitle="基于 OpenStreetMap 的产业分布可视化"
        />
        <div className="h-[calc(100vh-180px)] bg-muted animate-pulse rounded-lg border border-border" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title="产业地图"
        subtitle="基于 OpenStreetMap 的产业分布可视化"
      />

      <div className="relative h-[calc(100vh-180px)] rounded-xl overflow-hidden border border-border shadow-elevated">
        {/* ========== 真实地图 ========== */}
        <MapContainer
          center={zhengzhouCenter}
          zoom={11}
          minZoom={10}
          maxZoom={16}
          scrollWheelZoom
          style={{ height: "100%", width: "100%", zIndex: 0 }}
          zoomControl={false}
        >
          {/* 免费底图：OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* ── 行政区多边形（热力底色） ── */}
          {districtDistribution.map((d) => {
            const coords = districtBoundaries[d.name];
            if (!coords) return null;
            const heat =
              layer === "count" ? d.count / max : d.revenue / max;
            const selected = selectedDistrict === d.name;

            return (
              <Polygon
                key={d.name}
                positions={
                  coords.map(([lng, lat]) => [lat, lng] as [number, number])
                }
                pathOptions={{
                  fillColor: heatColor(heat, selected),
                  fillOpacity: selected ? 0.55 : 0.2 + heat * 0.35,
                  color: selected ? "#22d3ee" : "rgba(34,211,238,0.45)",
                  weight: selected ? 3 : 1.5,
                  dashArray: selected ? undefined : "4 4",
                }}
                eventHandlers={{
                  click: () => handleDistrictClick(d.name),
                }}
              >
                <LeafletTooltip
                  direction="top"
                  offset={[0, -8]}
                  opacity={1}
                  className="!bg-background !border !border-border !text-foreground !text-xs !px-2.5 !py-1.5 !rounded-lg !shadow-lg"
                >
                  <div className="font-semibold">{d.name}</div>
                  <div className="text-muted-foreground">
                    {d.count} 家企业 · {(d.revenue / 10000).toFixed(1)} 亿营收
                  </div>
                </LeafletTooltip>
              </Polygon>
            );
          })}

          {/* ── 企业标记点 ── */}
          {visible.map((e) => {
            const isMember = e.memberLevel !== "非会员";
            return (
              <CircleMarker
                key={e.id}
                center={[e.lat, e.lng]}
                radius={e.isListed ? 9 : isMember ? 6 : 4}
                pathOptions={{
                  fillColor: isMember ? "#fbbf24" : "#22d3ee",
                  color: "#0f172a",
                  weight: 2,
                  fillOpacity: 0.95,
                }}
              >
                <Popup className="text-sm">
                  <div className="space-y-1.5 min-w-[220px]">
                    <div className="font-semibold flex items-center gap-1.5 text-sm">
                      {e.name}
                      {isMember && (
                        <Crown className="h-3.5 w-3.5 text-warning inline" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {e.district} · {e.industries[0]} · {e.scale}
                    </div>
                    <div className="text-xs">
                      2024 营收：{(e.revenue[4].value / 10000).toFixed(2)} 亿
                    </div>
                    <div className="pt-1">
                      <Link
                        to="/enterprises/$id"
                        params={{ id: e.id }}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                      >
                        查看详情 <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* ========== 悬浮统计条（顶部） ========== */}
        <div className="absolute top-3 left-3 right-20 z-[400] flex gap-2 overflow-x-auto pointer-events-none">
          <div className="pointer-events-auto bg-background/90 backdrop-blur-md rounded-lg px-3.5 py-2 border border-border shadow-sm flex items-center gap-2 shrink-0">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">{visible.length}</span>
            <span className="text-[10px] text-muted-foreground">家</span>
          </div>
          <div className="pointer-events-auto bg-background/90 backdrop-blur-md rounded-lg px-3.5 py-2 border border-border shadow-sm flex items-center gap-2 shrink-0">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-xs font-semibold">
              {(stats.totalRevenue / 10000).toFixed(1)}
            </span>
            <span className="text-[10px] text-muted-foreground">亿营收</span>
          </div>
          <div className="pointer-events-auto bg-background/90 backdrop-blur-md rounded-lg px-3.5 py-2 border border-border shadow-sm flex items-center gap-2 shrink-0">
            <Users className="h-4 w-4 text-warning" />
            <span className="text-xs font-semibold">{stats.memberCount}</span>
            <span className="text-[10px] text-muted-foreground">家会员</span>
          </div>
          {stats.listedCount > 0 && (
            <div className="pointer-events-auto bg-background/90 backdrop-blur-md rounded-lg px-3.5 py-2 border border-border shadow-sm flex items-center gap-2 shrink-0">
              <Eye className="h-4 w-4 text-info" />
              <span className="text-xs font-semibold">{stats.listedCount}</span>
              <span className="text-[10px] text-muted-foreground">家上市</span>
            </div>
          )}
          {stats.riskCount > 0 && (
            <div className="pointer-events-auto bg-background/90 backdrop-blur-md rounded-lg px-3.5 py-2 border border-border shadow-sm flex items-center gap-2 shrink-0">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-xs font-semibold">{stats.riskCount}</span>
              <span className="text-[10px] text-muted-foreground">家风险</span>
            </div>
          )}
        </div>

        {/* ========== 左侧边栏 ========== */}
        <div className="absolute top-14 left-3 z-[400] w-64 space-y-3 pointer-events-none">
          {/* 图层控制 */}
          <div className="pointer-events-auto bg-background/95 backdrop-blur-md rounded-xl p-4 border border-border shadow-card">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              图层控制
            </h3>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2.5 cursor-pointer hover:text-primary transition rounded-md px-2 py-1.5 -mx-2 hover:bg-secondary/40">
                <input
                  type="radio"
                  className="accent-primary"
                  checked={layer === "count"}
                  onChange={() => setLayer("count")}
                />
                按企业数量着色
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer hover:text-primary transition rounded-md px-2 py-1.5 -mx-2 hover:bg-secondary/40">
                <input
                  type="radio"
                  className="accent-primary"
                  checked={layer === "revenue"}
                  onChange={() => setLayer("revenue")}
                />
                按营收规模着色
              </label>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <label className="flex items-center gap-2.5 text-sm cursor-pointer hover:text-primary transition rounded-md px-2 py-1.5 -mx-2 hover:bg-secondary/40">
                <input
                  type="checkbox"
                  className="accent-primary rounded"
                  checked={memberOnly}
                  onChange={(e) => setMemberOnly(e.target.checked)}
                />
                仅显示会员单位
              </label>
            </div>
          </div>

          {/* 区域排名 */}
          <div className="pointer-events-auto bg-background/95 backdrop-blur-md rounded-xl p-4 border border-border shadow-card max-h-[340px] overflow-y-auto">
            <h3 className="text-sm font-semibold mb-3">区域排名</h3>
            <div className="space-y-2">
              {districtDistribution
                .sort((a, b) =>
                  layer === "count"
                    ? b.count - a.count
                    : b.revenue - a.revenue,
                )
                .map((d) => {
                  const v = layer === "count" ? d.count : d.revenue;
                  const pct = (v / max) * 100;
                  const isSelected = selectedDistrict === d.name;
                  return (
                    <button
                      key={d.name}
                      onClick={() => handleDistrictClick(d.name)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg border transition-all text-sm",
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm"
                          : "border-border hover:bg-secondary/50 hover:border-primary/20",
                      )}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium">{d.name}</span>
                        <span className="tabular-nums text-muted-foreground">
                          {layer === "count"
                            ? `${d.count} 家`
                            : `${(d.revenue / 10000).toFixed(1)} 亿`}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-gradient-primary transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* ========== 右下角企业列表面板 ========== */}
        {showList && selectedDistrict && (
          <div className="absolute bottom-3 right-3 z-[400] w-80 bg-background/95 backdrop-blur-md rounded-xl border border-border shadow-elevated flex flex-col max-h-[55%] pointer-events-auto">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-semibold">{selectedDistrict}</h3>
                <p className="text-[11px] text-muted-foreground">
                  共 {visible.length} 家企业
                </p>
              </div>
              <button
                onClick={() => {
                  setShowList(false);
                  setSelectedDistrict(null);
                }}
                className="p-1.5 rounded-md hover:bg-secondary transition"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="overflow-y-auto p-2 space-y-0.5">
              {visible.map((e) => (
                <Link
                  key={e.id}
                  to="/enterprises/$id"
                  params={{ id: e.id }}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/60 transition group"
                >
                  <div className="h-9 w-9 rounded-lg bg-gradient-primary text-primary-foreground text-xs font-semibold flex items-center justify-center shrink-0">
                    {e.name.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate flex items-center gap-1">
                      <span className="group-hover:text-primary transition-colors">
                        {e.name}
                      </span>
                      {e.memberLevel !== "非会员" && (
                        <Crown className="h-3 w-3 text-warning shrink-0" />
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {e.industries[0]} · {e.scale} ·{" "}
                      {(e.revenue[4].value / 10000).toFixed(2)}亿
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ========== 左下角位置徽章 ========== */}
        <div className="absolute bottom-3 left-3 z-[400] pointer-events-none">
          <div className="pointer-events-auto bg-background/90 backdrop-blur-md rounded-lg border border-border shadow-sm px-3 py-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">郑州市</span>
          </div>
        </div>

        {/* ========== 图例（右下角/列表上方） ========== */}
        {!showList && (
          <div className="absolute bottom-3 right-3 z-[400] bg-background/90 backdrop-blur-md rounded-lg border border-border shadow-sm p-3 text-xs space-y-1.5 pointer-events-auto">
            <div className="font-semibold mb-1 text-[11px]">图例</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-foreground/20" />
              会员企业
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-foreground/20" />
              普通企业
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-amber-400 bg-transparent" />
              上市企业
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-2 rounded bg-blue-400/50 border border-blue-400/30" />
              热力强度
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
