import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { enterprises } from "@/lib/mock-data";
import { Network, Download, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chain")({ component: ChainPage });

const layers = [
  { name: "整机", desc: "整机设备：服务器、台式机、一体机、笔记本、工作站、手机、平板、电子设备、可穿戴设备等", color: "from-sky-500 to-blue-600" },
  { name: "外部设备", desc: "连接电脑主机的各种设备（如打印机、扫描仪、显示屏、高拍仪、摄像头、鼠标、键盘、音视频设备）", color: "from-blue-500 to-indigo-600" },
  { name: "芯片/半导体", desc: "CPU/GPU/DPU等芯片设计、芯片制造、芯片研究，半导体设备、存储芯片、RISV-V、物联网芯片、汽车芯片等", color: "from-indigo-500 to-violet-600" },
  { name: "传感设备", desc: "温度传感器、压力传感器、光电传感器、运动传感器、湿度传感器、气体传感器、超声波传感器、霍尔传感器、生物传感器、光纤传感器等", color: "from-violet-500 to-purple-600" },
  { name: "中间件", desc: "各种中间件产品", color: "from-purple-500 to-fuchsia-600" },
  { name: "操作系统", desc: "服务器操作系统、桌面操作系统、移动端操作系统、物联网操作系统等", color: "from-fuchsia-500 to-pink-600" },
  { name: "数据库", desc: "各种数据库产品", color: "from-pink-500 to-rose-600" },
  { name: "存储-硬件", desc: "存储设备（硬盘、U盘、存储服务器、蓝光存储等）", color: "from-rose-500 to-red-600" },
  { name: "存储-软件", desc: "分布式存储软件、存储管理软件等", color: "from-red-500 to-orange-600" },
  { name: "网络安全-硬件", desc: "防火墙、堡垒机、加密机、加密卡、入侵检测、网关、网闸、光闸、单导系统、VPN设备、密码设备", color: "from-orange-500 to-amber-600" },
  { name: "网络安全-软件", desc: "身份认证系统、态势感知、安全分析、供应链安全、杀毒软件、数据安全、工控安全、安全服务（等保测评、安全咨询）", color: "from-amber-500 to-yellow-600" },
  { name: "网络通信-硬件", desc: "基站设备、交换机、路由器、网桥、集线器、网络接口卡（NIC）、无线接入点（WAP）、调制解调器、通信基站、光端机、光纤收发器等", color: "from-lime-500 to-green-600" },
  { name: "网络通信-软件", desc: "即时通信、网管系统、网络优化、通信管理、通信计费、网络服务、网站服务", color: "from-green-500 to-emerald-600" },
  { name: "办公流版签", desc: "流版签软件", color: "from-emerald-500 to-teal-600" },
  { name: "管理软件", desc: "针对企业、党政等各类机构内部管理类的应用软件（如协同办公、ERP、人力资源、仓库管理、财务、营销、供应链管理、会议、电子邮件等）", color: "from-teal-500 to-cyan-600" },
  { name: "行业应用", desc: "除管理软件、流版签之外的其它业务应用软件或硬件，覆盖党政、金融、能源、卫生健康、教育、制造业等各行业业务场景", color: "from-cyan-500 to-sky-600" },
  { name: "工业软件", desc: "专用于工业领域的软件，包括CAD、CAE、CAM、PDM/PLM、MES、EDA等", color: "from-blue-600 to-blue-800" },
  { name: "大数据", desc: "大数据平台、大数据治理、大数据分析、大数据工具、数据交易、数据加工、数据要素等", color: "from-cyan-600 to-cyan-800" },
  { name: "AI", desc: "人工智能、机器学习平台、通用/垂直大模型、算法、智能体、生成式人工智能", color: "from-violet-600 to-violet-800" },
  { name: "未来信息", desc: "6G、脑机接口、量子信息、未来显示、智能机器人、人形机器人、未来网络、具身智能", color: "from-fuchsia-600 to-fuchsia-800" },
  { name: "元宇宙/数字孪生", desc: "VR/AR/XR技术、数字人、数字孪生、游戏引擎、渲染呈现、体感设备、3D建模软件及交互AI技术", color: "from-purple-600 to-purple-800" },
  { name: "集成服务", desc: "主要做系统集成的企业", color: "from-emerald-600 to-emerald-800" },
  { name: "云计算", desc: "云计算管理平台、虚拟化系统、云服务提供商", color: "from-sky-600 to-sky-800" },
  { name: "运维服务", desc: "提供各种运维服务的企业", color: "from-teal-600 to-teal-800" },
  { name: "智库机构", desc: "联盟、协会、科研院所、高校、测评适配服务、开源组织等", color: "from-amber-600 to-amber-800" },
  { name: "工具软件", desc: "编程语言、编程框架、编译工具、低代码平台、设计工具（原型设计、绘画工具等）", color: "from-orange-600 to-orange-800" },
  { name: "其它", desc: "不属于以上类型或无任何信息的机构", color: "from-gray-500 to-gray-700" },
];

function ChainPage() {
  const layerStats = layers.map((l) => {
    const ents = enterprises.filter((e) => e.chainLayer === l.name);
    return { ...l, count: ents.length, revenue: Math.round(ents.reduce((s, e) => s + e.revenue![4].value, 0) / 10000) };
  });
  const max = Math.max(...layerStats.map((l) => l.count), 1);
  const weakest = layerStats.slice().sort((a, b) => a.count - b.count)[0];
  const filledCount = layerStats.filter((l) => l.count > 0).length;
  const fillRate = ((filledCount / layers.length) * 100).toFixed(0);

  return (
    <AppShell>
      <PageHeader
        title="产业链图谱"
        subtitle={`覆盖 ${layers.length} 个产业链环节 · 已填充 ${filledCount} 个环节（${fillRate}%）`}
        actions={
          <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-input text-sm hover:bg-accent">
            <Download className="h-4 w-4" />导出产业链分析
          </button>
        }
      />

      <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
        <div className="text-sm">
          <span className="font-semibold">产业链薄弱环节识别：</span>
          <span className="text-muted-foreground">
            当前 <span className="font-semibold text-warning-foreground">{weakest.name}</span>（{weakest.desc.slice(0, 40)}…）本地企业仅 {weakest.count} 家，另有 {layerStats.filter((l) => l.count === 0).length} 个环节暂无企业覆盖，建议加强招商引资力度，引入优质上下游企业完善生态。
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
        {layerStats.map((l, idx) => {
          const heat = max > 0 ? l.count / max : 0;
          const ents = enterprises.filter((e) => e.chainLayer === l.name);
          return (
            <div key={l.name} className="bg-card border border-border rounded-lg shadow-card overflow-hidden flex flex-col">
              <div className={cn("h-1", l.count > 0 ? `bg-gradient-to-r ${l.color}` : "bg-muted")} />
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start gap-2.5 mb-2">
                  <div className={cn(
                    "h-7 w-7 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0",
                    l.count > 0 ? `bg-gradient-to-br ${l.color} text-white` : "bg-muted text-muted-foreground",
                  )}>
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-tight">{l.name}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{l.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-auto mb-2">
                  <div>
                    <span className={cn("text-lg font-bold tabular-nums", l.count === 0 && "text-muted-foreground")}>{l.count}</span>
                    <span className="text-[10px] text-muted-foreground ml-0.5">家</span>
                  </div>
                  <div className={cn(
                    "text-[11px] px-1.5 py-0.5 rounded font-medium",
                    l.count === 0 ? "bg-muted text-muted-foreground" :
                    heat > 0.5 ? "bg-success/15 text-success" :
                    heat > 0.2 ? "bg-info/15 text-info" :
                    "bg-warning/15 text-warning-foreground",
                  )}>
                    {l.count === 0 ? "空缺" : heat > 0.5 ? "充足" : heat > 0.2 ? "一般" : "薄弱"}
                  </div>
                </div>

                <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-2">
                  <div
                    className={cn("h-full rounded-full transition-all", l.count > 0 ? `bg-gradient-to-r ${l.color}` : "bg-muted")}
                    style={{ width: `${Math.max(heat * 100, l.count > 0 ? 4 : 0)}%` }}
                  />
                </div>

                {ents.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {ents.slice(0, 3).map((e) => (
                      <span key={e.id} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">{e.name.replace("股份有限公司", "")}</span>
                    ))}
                    {ents.length > 3 && <span className="text-[10px] px-1.5 py-0.5 text-muted-foreground">+{ents.length - 3}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-lg p-5 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <Network className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">产业链上下游协同关系</h3>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed">
          信创产业链覆盖从底层硬件（整机、芯片/半导体、传感设备、存储硬件、网络通信硬件）到基础软件（操作系统、数据库、中间件、存储软件）、
          网络安全、应用软件（办公流版签、管理软件、行业应用、工业软件）、新兴技术（大数据、AI、未来信息、元宇宙/数字孪生、云计算、工具软件）、
          以及配套服务（集成服务、运维服务、智库机构、外部设备）的完整产业生态。
          当前本地产业链填充率为 <span className="font-semibold text-foreground">{fillRate}%</span>（{filledCount}/{layers.length} 环节有企业覆盖），
          建议在薄弱和空缺环节加大招商力度。
        </div>
      </div>
    </AppShell>
  );
}
