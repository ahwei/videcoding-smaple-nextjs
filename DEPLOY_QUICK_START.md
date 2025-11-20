# 🚀 快速部署指南 (Quick Deployment Guide)

## ⚡ 30秒快速开始

### 推荐: Vercel (最简单)
```bash
# 1. 登录/注册
vercel login

# 2. 部署
vercel --prod

# 3. 设置数据库环境变量
# 在 Vercel Dashboard 中设置 DATABASE_URL

# 4. 完成！
```

**部署时间**: ~2 分钟

---

## 📝 完整部署清单

### ✅ 部署前检查 (5 分钟)

```bash
# 1. 验证构建 (在本地 C:\ 驱动器上运行，避免 OneDrive 锁定)
pnpm deploy:verify

# 2. 提交代码
git add .
git commit -m "準備部署"
git push origin main
```

### 📊 选择部署平台

| 平台 | 难度 | 成本 | 特点 |
|------|------|------|------|
| **Vercel** | ⭐ | 免费/付费 | 最简单，Next.js 官方 |
| **Railway** | ⭐⭐ | 免费/付费 | 简单，支持数据库 |
| **Render** | ⭐⭐ | 免费/付费 | 可靠，功能全面 |
| **AWS EC2** | ⭐⭐⭐ | 按量计费 | 完全控制，复杂 |
| **Docker** | ⭐⭐⭐ | 自定义 | 灵活，需要服务器 |

---

## 🎯 方案 1: Vercel (推荐)

### 步骤 1: 准备 GitHub
```bash
# 确保代码已推送
git push origin main
```

### 步骤 2: Vercel 部署
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 导入 GitHub 仓库
4. 项目设置：
   - Framework: Next.js ✅ (自动检测)
   - Build Command: `prisma generate && next build` ✅
   - Output Directory: `.next` ✅

### 步骤 3: 环境变量
在 Vercel Dashboard 中设置:
```
DATABASE_URL = postgresql://user:pass@host:port/db?sslmode=require
```

### 步骤 4: 数据库迁移
部署完成后，运行:
```bash
vercel env pull .env.local
pnpm prisma migrate deploy
```

### 步骤 5: 验证
访问 https://your-project.vercel.app

✅ **完成！** 每次 `git push` 会自动部署

---

## 🎯 方案 2: Railway

### 步骤 1: 创建项目
1. 访问 [railway.app](https://railway.app)
2. 点击 "New Project"
3. 选择 "Deploy from GitHub"
4. 连接 GitHub

### 步骤 2: 添加数据库
```bash
# 在 Railway Dashboard
# 点击 "+Create" > PostgreSQL
# 自动连接 DATABASE_URL
```

### 步骤 3: 配置
```toml
# railway.toml (已自动生成)
[build]
builder = "nixpacks"
buildCommand = "pnpm install && pnpm build"

[deploy]
startCommand = "pnpm start"
port = 3000
```

### 步骤 4: 部署
Railway 自动部署！✅

---

## 🎯 方案 3: Docker + 自己的服务器

### 步骤 1: 创建 Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建
RUN pnpm build

# 暴露端口
EXPOSE 3000

# 运行应用
CMD ["pnpm", "start"]
```

### 步骤 2: 创建 docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@db:5432/breakfast
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: secure_password
      POSTGRES_DB: breakfast
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### 步骤 3: 部署
```bash
# 本地测试
docker-compose up

# 生产部署
docker build -t breakfast-app .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  breakfast-app
```

---

## 🔧 故障排查

### 错误 1: `DATABASE_URL not found`
```bash
# 解决方案: 在部署平台中设置环境变量
# Vercel: Settings > Environment Variables
# Railway: Variables (自动)
# Docker: -e DATABASE_URL="..."
```

### 错误 2: `ECONNREFUSED` 数据库连接失败
```bash
# 原因: 数据库不可访问
# 解决:
# 1. 检查 DATABASE_URL 格式
# 2. 检查数据库防火墙规则
# 3. 测试连接: pnpm db:test
```

### 错误 3: 构建失败 "prisma generate"
```bash
# 原因: Prisma 无法生成客户端
# 解决:
prisma generate
pnpm build
```

### 错误 4: 页面 404
```bash
# 原因: 路由不匹配或构建不正确
# 解决:
# 1. 检查 .next 文件夹
# 2. 清理: rm -rf .next
# 3. 重建: pnpm build
```

---

## 📊 部署后检查清单

### 🟢 功能验证
- [ ] 首页加载 (products)
- [ ] 购物车功能
- [ ] 订单创建
- [ ] 订单历史查看
- [ ] API 响应正常

### 🟢 性能检查
- [ ] 页面加载 < 2s
- [ ] API 响应 < 200ms
- [ ] Lighthouse 评分 > 80

### 🟢 安全检查
- [ ] HTTPS 工作
- [ ] 敏感数据未暴露
- [ ] 错误消息不含敏感信息
- [ ] CORS 配置正确

### 🟢 监控设置
- [ ] 日志记录已启用
- [ ] 告警已配置
- [ ] 备份计划制定

---

## 📈 监控和维护

### 查看日志

**Vercel**:
```bash
vercel logs
```

**Railway**:
```bash
railway logs
```

**Docker**:
```bash
docker logs <container_id>
```

### 更新应用

```bash
# 1. 提交更改
git add .
git commit -m "更新"

# 2. 推送
git push origin main

# 3. 自动部署
# Vercel/Railway 会自动部署新版本
```

### 回滚部署

**Vercel**:
1. 访问 Deployments
2. 选择之前的版本
3. 点击 "Redeploy"

**Railway**:
1. 选择之前的 Deployment
2. 设置为 Active

---

## 💰 成本估算

### Vercel 免费层
- 部署: 无限
- 函数执行: 100GB/月
- 带宽: 1TB/月
- 完全免费!

### PostgreSQL 成本
- Neon (推荐): 免费/按量计费
- Railway: $7/月 起
- AWS RDS: $15/月 起

### 总成本
- **小规模 (< 10k 用户)**: 免费 ~ $10/月
- **中规模 (10k~100k 用户)**: $20~50/月
- **大规模 (> 100k)**: 按使用量计费

---

## 🎓 最佳实践

### ✅ 部署前
- [ ] 本地测试通过
- [ ] `pnpm deploy:verify` 通过
- [ ] 代码评审完成
- [ ] 备份已创建

### ✅ 部署中
- [ ] 监控部署进度
- [ ] 检查构建日志
- [ ] 验证数据库迁移

### ✅ 部署后
- [ ] 功能测试
- [ ] 性能监控
- [ ] 日志审查
- [ ] 团队通知

### ✅ 持续维护
- [ ] 定期备份
- [ ] 安全补丁更新
- [ ] 依赖更新
- [ ] 性能优化

---

## 📞 获取帮助

### 文档
- [部署检查清单](./DEPLOYMENT_CHECKLIST.md)
- [部署报告](./DEPLOYMENT_REPORT.md)
- [Next.js 文档](https://nextjs.org/docs)

### 支持渠道
- Vercel: https://vercel.com/support
- Railway: https://railway.app/support
- Prisma: https://prisma.io/support

### 自定义域名 (可选)

**Vercel**:
1. Settings > Domains
2. 添加自定义域
3. 更新 DNS 记录

**成本**: 
- Vercel 托管: 免费
- 域名注册: $10~15/年

---

## ✨ 完成！

你的应用现已上线！🎉

访问 URL: `https://your-domain.com`

管理仪表板:
- Vercel: https://vercel.com/dashboard
- Railway: https://railway.app/dashboard
- Docker: 本地 localhost:3000

---

**最后更新**: 2025-11-20  
**状态**: ✅ 已验证  
**部署时间**: ~15-30 分钟
