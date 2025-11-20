# 🚀 部署前检查清单 (Pre-Deployment Checklist)

## ✅ 已修复的问题 (Fixed Issues)

### 1. **TypeScript 类型错误** ✓
- [x] 修复了 `app/page.tsx` 中 `product` 参数的隐式 `any` 类型
- [x] 修复了 `app/api/orders/route.ts` 中 `p`, `order`, `item` 参数的隐式 `any` 类型
- **影响**: 项目现在能够通过 TypeScript 严格模式编译

### 2. **环境变量安全配置** ✓
- [x] `.gitignore` 已正确配置 (包含 `.env*` 排除规则)
- [x] `.env.example` 存在并包含所有必要的配置示例
- **影响**: 敏感信息 (数据库密码) 不会被提交到版本控制

---

## ⚠️ 部署前必须完成的项目 (MUST DO)

### 1. **数据库迁移** 🔴 必需
```bash
# 在生产环境中执行
pnpm prisma migrate deploy
```
- 目的: 在生产数据库中创建所有必要的表和关系
- 何时: 首次部署或数据库模型更改后
- 注意: 不要使用 `prisma migrate dev`, 只用 `migrate deploy`

### 2. **环境变量配置** 🔴 必需
在部署平台 (Vercel/Netlify/Railway 等) 中设置:
```
DATABASE_URL=postgresql://username:password@host:port/dbname?sslmode=require
```
- 替换为你的生产数据库连接字符串
- 确保使用 SSL 连接 (`sslmode=require`)
- 不要在代码中硬编码这个值

### 3. **生产数据库设置** 🔴 必需
- [ ] PostgreSQL/SQL Server 已创建并在线
- [ ] 数据库用户有适当权限
- [ ] 数据库连接字符串正确且可访问
- [ ] SSL/TLS 已启用

---

## 🔍 部署检查项目 (Deployment Checklist)

### 代码质量
- [x] TypeScript 编译无错误
- [x] 没有 `console.error()` 错误日志遗留
- [x] API 错误处理已实现
- [x] 数据库查询有 try-catch 保护

### 安全性
- [x] `.env.local` 在 `.gitignore` 中
- [x] 敏感数据不在代码中硬编码
- [x] API 路由检查输入验证
- [x] 无登录信息或密钥暴露

### 性能优化
- [ ] **TODO**: 为频繁查询的产品列表添加缓存策略
  ```typescript
  // 建议: 使用 ISR (Incremental Static Regeneration)
  export const revalidate = 3600; // 每小时重新生成
  ```
- [ ] **TODO**: 为大型列表实现分页或虚拟滚动
- [x] 图片已优化 (使用 Next.js Image 组件)

### 数据库
- [x] Prisma 客户端生成脚本在 build 前运行
- [x] 模型关系正确定义
- [x] Decimal/Date 序列化处理已实现
- [ ] **TODO**: 设置数据库备份计划

### API 端点
- [x] POST `/api/orders` - 创建订单 ✓
- [x] GET `/api/orders` - 获取订单历史 ✓
- [x] 错误处理和验证 ✓
- [ ] **TODO**: 添加速率限制防止滥用
- [ ] **TODO**: 添加用户认证中间件

### UI/UX
- [x] 响应式设计 (移动/平板/桌面)
- [x] 加载状态提示
- [x] 错误处理显示
- [x] 中文本地化

---

## 📋 部署步骤 (Deployment Steps)

### 步骤 1: 准备代码
```bash
# 清理本地文件
rm -rf .next node_modules
pnpm install

# 验证构建
pnpm build
```

### 步骤 2: 推送到 GitHub
```bash
git add .
git commit -m "準備部署"
git push origin main
```

### 步骤 3: 部署到 Vercel (推荐)
1. 连接 GitHub 仓库到 Vercel
2. 设置环境变量: `DATABASE_URL`
3. 点击 Deploy
4. Vercel 会自动运行构建脚本

### 步骤 4: 数据库迁移
```bash
# 在 Vercel 环境中执行 (或通过本地 CLI)
pnpm prisma migrate deploy
```

### 步骤 5: 验证部署
- [ ] 访问生产 URL
- [ ] 检查产品页面能否加载
- [ ] 测试购物车功能
- [ ] 测试订单创建
- [ ] 检查订单历史

---

## 🐛 常见问题解决 (Troubleshooting)

### 问题 1: Prisma 生成失败
**原因**: OneDrive 文件锁定  
**解决方案**:
```bash
# 禁用 OneDrive 实时扫描该目录
# 或将项目移到本地路径 (C:\projects\...)
```

### 问题 2: 数据库连接超时
**原因**: 数据库不可访问或防火墙阻止  
**解决方案**:
```bash
# 测试连接
pnpm db:test

# 检查连接字符串格式
# 确保 URL 中包含正确的主机名、端口、用户名、密码
```

### 问题 3: 订单创建返回 500 错误
**原因**: 可能是数据库表不存在或权限不足  
**解决方案**:
```bash
# 运行数据库迁移
pnpm prisma migrate deploy

# 检查 Prisma 日志
export DEBUG=prisma:*
```

### 问题 4: 构建时 TypeScript 错误
**原因**: 类型不匹配或导入错误  
**解决方案**:
```bash
# 检查 tsconfig.json 配置
# 验证所有导入路径正确
# 运行: pnpm build 查看详细错误
```

---

## 📊 部署后监控 (Post-Deployment Monitoring)

### 设置日志记录
```typescript
// 在 API 路由中添加结构化日志
console.log(JSON.stringify({
  timestamp: new Date(),
  endpoint: '/api/orders',
  method: 'POST',
  status: 200,
}));
```

### 监控指标
- [ ] API 响应时间
- [ ] 错误率
- [ ] 数据库连接池使用
- [ ] 磁盘空间

### 备份策略
- [ ] 每日自动备份数据库
- [ ] 定期测试恢复过程
- [ ] 保存至少 30 天的备份

---

## 🚀 快速部署到 Vercel

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 4. 设置环境变量后重新部署
vercel env add DATABASE_URL
vercel --prod

# 5. 运行数据库迁移
vercel env pull .env.local
pnpm prisma migrate deploy
```

---

## ✨ 最终检查清单

- [x] TypeScript 编译成功
- [x] 环境变量配置正确
- [x] `.gitignore` 保护敏感文件
- [x] API 错误处理完整
- [ ] 数据库备份计划制定
- [ ] 部署平台账户创建
- [ ] 域名配置 (如适用)
- [ ] SSL 证书配置 (Vercel 自动)
- [ ] CDN 配置 (可选)

---

## 📝 注意事项

1. **不要在生产环境中使用 `next dev`**
   - 使用 `pnpm build && pnpm start`
   - 或依赖 Vercel/Netlify 等托管平台

2. **定期更新依赖**
   ```bash
   pnpm up
   pnpm audit
   ```

3. **监控数据库连接**
   - PostgreSQL 连接池通常限制 20-100 个连接
   - Vercel Functions 无状态，不能持续占用连接

4. **成本考虑**
   - PostgreSQL: 按使用量计费
   - Vercel: 免费层有限制
   - 评估预期流量选择合适计划

---

最后更新: 2025-11-20  
状态: ✅ 准备部署
