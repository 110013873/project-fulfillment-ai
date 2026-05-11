import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("请输入用户名");
      return;
    }
    if (!password.trim()) {
      toast.error("请输入密码");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("登录成功", { description: `欢迎回来，${username}` });
      navigate({ to: "/" });
    }, 800);
  };

  return (
    <div className="min-h-screen flex">
      {/* 左侧品牌区 */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative z-10 text-primary-foreground text-center px-12">
          <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-6 ring-1 ring-white/30">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold mb-3">北京信创工委会</h1>
          <p className="text-lg opacity-90 mb-2">数据管理平台</p>
          <p className="text-sm opacity-70 max-w-sm mx-auto">
            聚·治·见 三位一体<br />
            汇聚企业数据 · 智能治理分析 · 精准决策支撑
          </p>
        </div>
      </div>

      {/* 右侧登录表单 */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 lg:hidden">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">系统登录</h2>
            <p className="text-sm text-muted-foreground mt-1">请输入您的账户信息</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">用户名</label>
              <div className="flex items-center gap-2 px-3 h-10 rounded-lg border border-input bg-background focus-within:ring-1 focus-within:ring-ring transition-shadow">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="输入用户名"
                  className="bg-transparent outline-none text-sm flex-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">密码</label>
              <div className="flex items-center gap-2 px-3 h-10 rounded-lg border border-input bg-background focus-within:ring-1 focus-within:ring-ring transition-shadow">
                <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入密码"
                  className="bg-transparent outline-none text-sm flex-1"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 rounded hover:bg-secondary transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded accent-primary"
                />
                <span className="text-muted-foreground">记住我</span>
              </label>
              <button type="button" className="text-primary hover:underline text-xs">忘记密码？</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <span className="inline-block h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  登录 <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>演示账号：任意用户名 + 任意密码均可登录</p>
          </div>
        </div>
      </div>
    </div>
  );
}
