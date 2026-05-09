// 模拟数据 - 信息产业协会平台

export type MemberLevel = "会长单位" | "副会长单位" | "常务理事单位" | "理事单位" | "普通会员单位" | "非会员";
export type DataStatus = "草稿" | "待审核" | "已发布" | "已停用";
export type CompanyNature = "国有" | "民营" | "外资" | "合资" | "其他";
export type CompanyScale = "大型" | "中型" | "小型" | "微型";
export type RiskLevel = "红" | "橙" | "黄" | "无";

export interface Enterprise {
  id: string;
  name: string;
  creditCode: string;
  foundDate: string;
  legalRep: string;
  registeredCapital: number;
  nature: CompanyNature;
  scale: CompanyScale;
  district: string;
  address: string;
  lng: number;
  lat: number;
  industries: string[];
  isListed: boolean;
  stockCode?: string;
  website?: string;
  intro: string;
  honors: string[];
  memberLevel: MemberLevel;
  memberJoinDate?: string;
  status: DataStatus;
  source: string;
  updatedAt: string;
  revenue: { year: number; value: number; profit: number }[];
  rdInvest?: number;
  employees?: number;
  marketCap?: number;
  patentCount?: number;
  riskLevel: RiskLevel;
  riskTypes: string[];
  chainLayer: "基础层" | "平台层" | "应用层" | "服务层";
}

export const districts = ["高新区", "经开区", "金水区", "中原区", "二七区", "管城区", "惠济区", "郑东新区"];
export const industryList = ["软件与信息服务", "电子信息制造", "通信与网络", "信息安全", "人工智能", "大数据与云计算", "数字内容与文创", "IT服务与集成"];
const honorsAll = ["高新技术企业", "国家级专精特新", "省级专精特新", "软件企业", "CMMI 5", "市级龙头企业"];
const industriesAll = industryList;
const natures: CompanyNature[] = ["民营", "国有", "外资", "合资"];
const scales: CompanyScale[] = ["大型", "中型", "小型", "微型"];
const memberLevels: MemberLevel[] = ["会长单位", "副会长单位", "常务理事单位", "理事单位", "普通会员单位", "非会员"];
const chainLayers = ["基础层", "平台层", "应用层", "服务层"] as const;

const namePool = [
  "中科信息", "鸿信科技", "智云数据", "天网安全", "云创软件", "万维网络", "数智未来", "星辰半导体",
  "海纳智能", "蓝海云计算", "极光大数据", "明远科技", "睿达通信", "联科信息", "晶华电子", "宇通智能",
  "源动力软件", "数字山河", "锐界科技", "信达科技", "新元集成", "智芯微电子", "翔宇网络", "九州数据",
  "云图智能", "鼎信科技", "纵横软件", "灵动信息", "拓普方案", "广信通信", "易联科技", "晨光软件",
  "瑞华信息", "通宇科技", "汇达数据", "鑫源电子", "博睿智能", "汉策科技", "百川软件", "中创信息",
];

function seedRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seedRand(42);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];
const pickN = <T,>(arr: readonly T[], n: number) => {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  return out;
};

const baseLng = 113.65;
const baseLat = 34.75;

export const enterprises: Enterprise[] = namePool.map((name, idx) => {
  const isListed = idx < 8;
  const scale = idx < 5 ? "大型" : idx < 15 ? "中型" : idx < 30 ? "小型" : "微型";
  const member = idx === 0 ? "会长单位" : idx < 6 ? "副会长单位" : idx < 14 ? "常务理事单位" : idx < 24 ? "理事单位" : idx < 34 ? "普通会员单位" : "非会员";
  const baseRev = isListed ? 80000 + rand() * 200000 : scale === "大型" ? 50000 + rand() * 30000 : scale === "中型" ? 5000 + rand() * 30000 : scale === "小型" ? 500 + rand() * 4000 : 100 + rand() * 400;
  const growth = 0.85 + rand() * 0.35;
  const revenue = [2020, 2021, 2022, 2023, 2024].map((year, i) => {
    const v = baseRev * Math.pow(growth, i - 4);
    return { year, value: Math.round(v), profit: Math.round(v * (rand() * 0.2 - 0.05)) };
  });
  const riskRand = rand();
  const riskLevel: RiskLevel = riskRand < 0.05 ? "红" : riskRand < 0.18 ? "橙" : riskRand < 0.32 ? "黄" : "无";
  const riskTypes: string[] = [];
  if (riskLevel === "红") riskTypes.push(pick(["失信被执行人", "经营异常名录"]));
  if (riskLevel === "橙") riskTypes.push(pick(["连续亏损", "营收大幅下滑", "行政处罚"]));
  if (riskLevel === "黄") riskTypes.push(pick(["招投标骤降", "数据长期未更新", "资质即将到期"]));
  return {
    id: `E${String(idx + 1).padStart(4, "0")}`,
    name: `${name}股份有限公司`,
    creditCode: `91410100MA${String(100000000 + idx * 17).padStart(9, "0")}H`,
    foundDate: `${2000 + Math.floor(rand() * 22)}-${String(1 + Math.floor(rand() * 12)).padStart(2, "0")}-${String(1 + Math.floor(rand() * 28)).padStart(2, "0")}`,
    legalRep: pick(["张伟", "李强", "王芳", "刘洋", "陈静", "杨磊", "赵敏", "黄涛"]),
    registeredCapital: Math.round((100 + rand() * 50000) * 10) / 10,
    nature: idx % 11 === 0 ? "国有" : idx % 13 === 0 ? "外资" : idx % 17 === 0 ? "合资" : "民营",
    scale,
    district: districts[idx % districts.length],
    address: `${districts[idx % districts.length]}科技大道${100 + idx * 7}号`,
    lng: baseLng + (rand() - 0.5) * 0.4,
    lat: baseLat + (rand() - 0.5) * 0.3,
    industries: pickN(industriesAll, 1 + Math.floor(rand() * 2)),
    isListed,
    stockCode: isListed ? `${600000 + idx * 13}` : undefined,
    website: `https://www.${name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
    intro: `${name}是一家专注于${pick(industriesAll)}领域的领先企业，深耕行业${5 + Math.floor(rand() * 20)}年，为客户提供专业的${pick(["软件解决方案", "云服务", "智能产品", "系统集成服务"])}。`,
    honors: pickN(honorsAll, Math.floor(rand() * 4)),
    memberLevel: member as MemberLevel,
    memberJoinDate: member !== "非会员" ? `${2015 + Math.floor(rand() * 10)}-${String(1 + Math.floor(rand() * 12)).padStart(2, "0")}-15` : undefined,
    status: rand() < 0.85 ? "已发布" : rand() < 0.5 ? "待审核" : "草稿",
    source: pick(["手动录入", "Excel导入", "官网抓取", "爬虫采集"]),
    updatedAt: `2025-${String(1 + Math.floor(rand() * 5)).padStart(2, "0")}-${String(1 + Math.floor(rand() * 28)).padStart(2, "0")}`,
    revenue,
    rdInvest: Math.round(revenue[4].value * (0.03 + rand() * 0.12)),
    employees: Math.round(50 + rand() * (isListed ? 5000 : 800)),
    marketCap: isListed ? Math.round(200000 + rand() * 800000) : undefined,
    patentCount: Math.floor(rand() * 200),
    riskLevel,
    riskTypes,
    chainLayer: chainLayers[idx % 4],
  };
});

// 招投标
export interface Tender {
  id: string;
  enterpriseId: string;
  enterpriseName: string;
  projectName: string;
  projectCode: string;
  tenderee: string;
  tendereeRegion: string;
  tendereeType: "政府机关" | "事业单位" | "国企" | "其他";
  projectType: "货物" | "服务" | "工程";
  amount: number;
  date: string;
  year: number;
  role: "中标方" | "联合体成员" | "分包方";
}

export const tenders: Tender[] = Array.from({ length: 120 }).map((_, i) => {
  const ent = enterprises[i % enterprises.length];
  const year = 2022 + Math.floor(rand() * 3);
  return {
    id: `T${String(i + 1).padStart(5, "0")}`,
    enterpriseId: ent.id,
    enterpriseName: ent.name,
    projectName: `${pick(["智慧城市", "政务云", "数据中心", "网络安全", "数字孪生", "AI平台", "工业互联网"])}${pick(["建设", "升级", "运维", "咨询"])}项目`,
    projectCode: `ZB${year}${String(1000 + i).padStart(5, "0")}`,
    tenderee: `${pick(["市", "省", "区"])}${pick(["发改委", "教育局", "公安局", "交通局", "卫健委", "国资委"])}`,
    tendereeRegion: pick(["本市", "省内", "全国"]),
    tendereeType: pick(["政府机关", "事业单位", "国企", "其他"]) as Tender["tendereeType"],
    projectType: pick(["货物", "服务", "工程"]) as Tender["projectType"],
    amount: Math.round(50 + rand() * 5000),
    date: `${year}-${String(1 + Math.floor(rand() * 12)).padStart(2, "0")}-${String(1 + Math.floor(rand() * 28)).padStart(2, "0")}`,
    year,
    role: pick(["中标方", "中标方", "中标方", "联合体成员", "分包方"]) as Tender["role"],
  };
});

// 活动
export interface Activity {
  id: string;
  name: string;
  type: "培训" | "论坛" | "对接会" | "参观考察" | "政策宣讲" | "其他";
  date: string;
  location: string;
  organizer: string;
  intro: string;
  participants: number;
  enterpriseIds: string[];
  status: "筹备中" | "已举办" | "已取消";
}

export const activities: Activity[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `A${String(i + 1).padStart(3, "0")}`,
  name: `${pick(["2025", "2024"])}年${pick(["数字经济", "人工智能", "信息安全", "云计算", "工业互联网"])}${pick(["高峰论坛", "技术对接会", "政策宣讲会", "企业培训", "行业沙龙"])}`,
  type: pick(["培训", "论坛", "对接会", "参观考察", "政策宣讲"]) as Activity["type"],
  date: `2025-${String(1 + Math.floor(rand() * 11)).padStart(2, "0")}-${String(1 + Math.floor(rand() * 28)).padStart(2, "0")}`,
  location: pick(["国际会展中心", "协会大厦多功能厅", "高新区管委会", "希尔顿酒店"]),
  organizer: "信息产业协会",
  intro: "本次活动旨在搭建企业交流平台，推动行业生态共建，促进产业链上下游协同发展。",
  participants: 50 + Math.floor(rand() * 300),
  enterpriseIds: enterprises.slice(0, 5 + Math.floor(rand() * 15)).map((e) => e.id),
  status: i < 12 ? "已举办" : i < 16 ? "筹备中" : "已取消",
}));

// 政策
export interface Policy {
  id: string;
  name: string;
  type: "资金补贴" | "税收优惠" | "人才政策" | "上市奖励" | "研发支持" | "其他";
  issuer: string;
  publishDate: string;
  deadline: string;
  conditions: string;
  subsidy: string;
  status: "申报中" | "已截止" | "已废止";
  matchedEnterprises: number;
  applied: number;
  approved: number;
}

export const policies: Policy[] = [
  { id: "P001", name: "高新技术企业认定奖励政策", type: "资金补贴", issuer: "市科技局", publishDate: "2025-01-15", deadline: "2025-09-30", conditions: "首次认定为高新技术企业的本市企业", subsidy: "一次性奖励20万元", status: "申报中", matchedEnterprises: 18, applied: 12, approved: 8 },
  { id: "P002", name: "专精特新企业培育扶持办法", type: "资金补贴", issuer: "市工信局", publishDate: "2025-02-20", deadline: "2025-12-31", conditions: "国家级/省级专精特新企业", subsidy: "国家级50万,省级20万", status: "申报中", matchedEnterprises: 12, applied: 9, approved: 7 },
  { id: "P003", name: "软件企业研发投入加计扣除", type: "税收优惠", issuer: "市税务局", publishDate: "2024-12-01", deadline: "2025-06-30", conditions: "经认定的软件企业,研发投入占比≥6%", subsidy: "研发费用175%加计扣除", status: "申报中", matchedEnterprises: 28, applied: 20, approved: 18 },
  { id: "P004", name: "企业上市奖励政策", type: "上市奖励", issuer: "市金融办", publishDate: "2024-08-10", deadline: "2025-12-31", conditions: "在A股、港股、新三板挂牌上市的本市企业", subsidy: "最高奖励500万元", status: "申报中", matchedEnterprises: 5, applied: 3, approved: 2 },
  { id: "P005", name: "产业人才引进补贴", type: "人才政策", issuer: "市人社局", publishDate: "2025-03-01", deadline: "2025-11-30", conditions: "引进高层次人才的信息产业企业", subsidy: "每人5-30万安家费", status: "申报中", matchedEnterprises: 22, applied: 14, approved: 11 },
  { id: "P006", name: "数字化转型示范项目", type: "资金补贴", issuer: "市发改委", publishDate: "2024-10-15", deadline: "2025-04-30", conditions: "营收5000万以上规上企业", subsidy: "项目投资额20%补贴", status: "已截止", matchedEnterprises: 16, applied: 11, approved: 9 },
];

// 报告
export interface Report {
  id: string;
  title: string;
  type: "年度行业发展报告" | "季度动态简报" | "专项分析报告" | "统计报表";
  date: string;
  author: string;
  status: "草稿" | "已发布";
  summary: string;
}

export const reports: Report[] = [
  { id: "R001", title: "2024年信息产业发展白皮书", type: "年度行业发展报告", date: "2025-01-20", author: "协会研究部", status: "已发布", summary: "全市信息产业全年综述,营收同比增长12.3%,新增上市企业3家。" },
  { id: "R002", title: "2025年第一季度产业动态简报", type: "季度动态简报", date: "2025-04-10", author: "协会研究部", status: "已发布", summary: "Q1企业新增12家,中标项目同比增长18%,高新企业认定5家。" },
  { id: "R003", title: "人工智能产业链分析报告", type: "专项分析报告", date: "2025-03-15", author: "协会专家组", status: "已发布", summary: "本市AI产业基础层薄弱,应用层企业聚集明显,建议重点扶持算力基础设施。" },
  { id: "R004", title: "软件业统计季报(Q1)", type: "统计报表", date: "2025-04-15", author: "信息化局", status: "已发布", summary: "对应工信部软件业统计调查制度填报。" },
  { id: "R005", title: "2025上半年招投标分析", type: "专项分析报告", date: "2025-07-01", author: "协会研究部", status: "草稿", summary: "上半年累计中标金额28.6亿元,政府类项目占比62%。" },
];

// KPI
export interface KpiItem {
  name: string;
  current: number;
  prev: number;
  unit: string;
  target?: number;
  source: string;
}

export const kpis: KpiItem[] = [
  { name: "软件业务收入", current: 1268.4, prev: 1132.5, unit: "亿元", target: 1400, source: "企业经营数据" },
  { name: "信息产业营收总量", current: 2856.7, prev: 2543.2, unit: "亿元", target: 3000, source: "企业经营数据" },
  { name: "规上企业数量", current: 248, prev: 221, unit: "家", target: 280, source: "经营数据" },
  { name: "本年新增上市企业数", current: 3, prev: 2, unit: "家", target: 5, source: "经营+荣誉" },
  { name: "高新技术企业数量", current: 156, prev: 138, unit: "家", target: 180, source: "荣誉资质库" },
  { name: "国家级专精特新企业", current: 28, prev: 21, unit: "家", target: 35, source: "荣誉资质库" },
  { name: "软件著作权登记量", current: 4286, prev: 3712, unit: "件", source: "经营数据" },
  { name: "信息产业从业人员", current: 18.6, prev: 17.2, unit: "万人", source: "经营数据" },
  { name: "企业研发投入合计", current: 286.4, prev: 248.6, unit: "亿元", target: 320, source: "经营数据" },
  { name: "研发投入占营收比", current: 10.03, prev: 9.78, unit: "%", source: "自动计算" },
];

// 爬虫任务
export interface CrawlerTask {
  id: string;
  name: string;
  source: string;
  type: string;
  frequency: string;
  lastRun: string;
  nextRun: string;
  status: "运行中" | "已停用" | "失败";
  successCount: number;
  failCount: number;
}

export const crawlerTasks: CrawlerTask[] = [
  { id: "C001", name: "上交所公告采集", source: "sse.com.cn", type: "上市公司年报", frequency: "每日 02:00", lastRun: "2025-05-08 02:00", nextRun: "2025-05-09 02:00", status: "运行中", successCount: 245, failCount: 2 },
  { id: "C002", name: "深交所公告采集", source: "szse.cn", type: "上市公司年报", frequency: "每日 02:30", lastRun: "2025-05-08 02:30", nextRun: "2025-05-09 02:30", status: "运行中", successCount: 198, failCount: 1 },
  { id: "C003", name: "巨潮资讯网年报", source: "cninfo.com.cn", type: "年度财报", frequency: "每周 周一 03:00", lastRun: "2025-05-05 03:00", nextRun: "2025-05-12 03:00", status: "运行中", successCount: 87, failCount: 0 },
  { id: "C004", name: "中国政府采购网", source: "ccgp.gov.cn", type: "招投标", frequency: "每日 06:00", lastRun: "2025-05-08 06:00", nextRun: "2025-05-09 06:00", status: "运行中", successCount: 1248, failCount: 12 },
  { id: "C005", name: "市政府采购平台", source: "本市", type: "招投标", frequency: "每日 06:30", lastRun: "2025-05-08 06:30", nextRun: "2025-05-09 06:30", status: "运行中", successCount: 386, failCount: 3 },
  { id: "C006", name: "国家企业信用公示", source: "gsxt.gov.cn", type: "工商信息", frequency: "每周 周日 04:00", lastRun: "2025-05-04 04:00", nextRun: "2025-05-11 04:00", status: "失败", successCount: 56, failCount: 5 },
];

// 用户
export interface SystemUser {
  id: string;
  username: string;
  realName: string;
  role: "系统管理员" | "协会管理员" | "普通查看用户";
  email: string;
  status: "启用" | "禁用";
  lastLogin: string;
}

export const systemUsers: SystemUser[] = [
  { id: "U001", username: "admin", realName: "张管理", role: "系统管理员", email: "admin@assoc.org", status: "启用", lastLogin: "2025-05-08 09:32" },
  { id: "U002", username: "lisecretary", realName: "李秘书", role: "协会管理员", email: "li@assoc.org", status: "启用", lastLogin: "2025-05-08 08:45" },
  { id: "U003", username: "wangzhang", realName: "王部长", role: "协会管理员", email: "wang@assoc.org", status: "启用", lastLogin: "2025-05-07 17:20" },
  { id: "U004", username: "viewer1", realName: "信息化局-赵处长", role: "普通查看用户", email: "zhao@gov.cn", status: "启用", lastLogin: "2025-05-08 10:15" },
  { id: "U005", username: "viewer2", realName: "信息化局-钱科长", role: "普通查看用户", email: "qian@gov.cn", status: "启用", lastLogin: "2025-05-06 14:30" },
];

// 操作日志
export interface AuditLog {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  ip: string;
}

export const auditLogs: AuditLog[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `L${String(i + 1).padStart(4, "0")}`,
  user: pick(["admin", "lisecretary", "wangzhang"]),
  action: pick(["登录", "新增企业", "审核通过", "修改会员等级", "导出数据", "录入资质", "发布报告", "驳回审核"]),
  target: pick(["中科信息股份有限公司", "鸿信科技股份有限公司", "智云数据股份有限公司", "系统配置"]),
  time: `2025-05-${String(1 + Math.floor(rand() * 8)).padStart(2, "0")} ${String(8 + Math.floor(rand() * 10)).padStart(2, "0")}:${String(Math.floor(rand() * 60)).padStart(2, "0")}`,
  ip: `10.0.${Math.floor(rand() * 256)}.${Math.floor(rand() * 256)}`,
}));

// 聚合统计
export const stats = {
  totalEnterprises: enterprises.filter((e) => e.status === "已发布").length,
  newThisYear: 12,
  totalRevenue: enterprises.reduce((s, e) => s + (e.revenue[4]?.value || 0), 0),
  listedCount: enterprises.filter((e) => e.isListed).length,
  totalMarketCap: enterprises.reduce((s, e) => s + (e.marketCap || 0), 0),
  yearTenderAmount: tenders.filter((t) => t.year === 2024).reduce((s, t) => s + t.amount, 0),
  yearTenderCount: tenders.filter((t) => t.year === 2024).length,
  highTechCount: enterprises.filter((e) => e.honors.includes("高新技术企业")).length,
  specializedCount: enterprises.filter((e) => e.honors.some((h) => h.includes("专精特新"))).length,
  memberCount: enterprises.filter((e) => e.memberLevel !== "非会员").length,
  pendingAudit: enterprises.filter((e) => e.status === "待审核").length,
  riskCount: enterprises.filter((e) => e.riskLevel !== "无").length,
  redRiskCount: enterprises.filter((e) => e.riskLevel === "红").length,
};

export const industryDistribution = industriesAll.map((name) => ({
  name,
  value: enterprises.filter((e) => e.industries.includes(name)).length,
}));

export const districtDistribution = districts.map((name) => ({
  name,
  count: enterprises.filter((e) => e.district === name).length,
  revenue: Math.round(enterprises.filter((e) => e.district === name).reduce((s, e) => s + (e.revenue[4]?.value || 0), 0)),
}));

export const yearTrend = [2020, 2021, 2022, 2023, 2024].map((year) => ({
  year,
  revenue: Math.round(enterprises.reduce((s, e) => s + (e.revenue.find((r) => r.year === year)?.value || 0), 0) / 10000),
  count: 200 + (year - 2020) * 25 + Math.floor(rand() * 10),
}));
