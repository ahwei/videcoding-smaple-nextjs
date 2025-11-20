#!/usr/bin/env node
/**
 * 部署前检查脚本
 * Pre-deployment verification script
 * 
 * 用法: pnpm node scripts/deployment-check.ts
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const checks = [];

interface Check {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

function addCheck(check: Check) {
  checks.push(check);
}

function fileExists(filePath: string): boolean {
  return fs.existsSync(path.join(ROOT, filePath));
}

function fileContains(filePath: string, text: string): boolean {
  try {
    const content = fs.readFileSync(path.join(ROOT, filePath), 'utf-8');
    return content.includes(text);
  } catch {
    return false;
  }
}

console.log('\n🚀 Next.js 部署前检查 (Pre-deployment Checks)\n');
console.log('='*60);

// 检查 1: 必要文件
console.log('\n📁 检查必要文件...');
if (fileExists('package.json')) {
  addCheck({ name: 'package.json', status: 'pass', message: '✅ 找到' });
} else {
  addCheck({ name: 'package.json', status: 'fail', message: '❌ 未找到' });
}

if (fileExists('.env.example')) {
  addCheck({ name: '.env.example', status: 'pass', message: '✅ 找到' });
} else {
  addCheck({ name: '.env.example', status: 'warn', message: '⚠️ 不存在' });
}

if (fileExists('next.config.ts')) {
  addCheck({ name: 'next.config.ts', status: 'pass', message: '✅ 找到' });
} else {
  addCheck({ name: 'next.config.ts', status: 'fail', message: '❌ 未找到' });
}

// 检查 2: 环境变量安全
console.log('\n🔐 检查环境变量安全...');
if (fileExists('.gitignore') && fileContains('.gitignore', '.env')) {
  addCheck({ name: '.env 在 .gitignore', status: 'pass', message: '✅ 已隐藏' });
} else {
  addCheck({ name: '.env 在 .gitignore', status: 'fail', message: '❌ 暴露风险' });
}

if (fileExists('.env.local')) {
  addCheck({ name: '.env.local 存在', status: 'pass', message: '✅ 本地配置已设置' });
} else {
  addCheck({ name: '.env.local 存在', status: 'warn', message: '⚠️ 需要手动创建' });
}

// 检查 3: TypeScript 配置
console.log('\n📝 检查 TypeScript 配置...');
if (fileExists('tsconfig.json')) {
  const tsconfig = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'tsconfig.json'), 'utf-8')
  );
  
  const hasStrict = tsconfig.compilerOptions?.strict === true;
  if (hasStrict) {
    addCheck({ name: '严格模式', status: 'pass', message: '✅ 已启用' });
  } else {
    addCheck({ name: '严格模式', status: 'warn', message: '⚠️ 建议启用' });
  }
} else {
  addCheck({ name: 'tsconfig.json', status: 'fail', message: '❌ 未找到' });
}

// 检查 4: API 端点
console.log('\n🔌 检查 API 端点...');
if (fileExists('app/api/orders/route.ts')) {
  addCheck({ name: 'API: /api/orders', status: 'pass', message: '✅ 存在' });
} else {
  addCheck({ name: 'API: /api/orders', status: 'fail', message: '❌ 缺失' });
}

// 检查 5: 数据库
console.log('\n🗄️ 检查数据库配置...');
if (fileExists('prisma/schema.prisma')) {
  const schema = fs.readFileSync(
    path.join(ROOT, 'prisma/schema.prisma'),
    'utf-8'
  );
  
  if (schema.includes('datasource db')) {
    addCheck({ name: '数据源配置', status: 'pass', message: '✅ 已配置' });
  } else {
    addCheck({ name: '数据源配置', status: 'fail', message: '❌ 缺失' });
  }
  
  if (schema.includes('generator client')) {
    addCheck({ name: 'Prisma 生成器', status: 'pass', message: '✅ 已配置' });
  } else {
    addCheck({ name: 'Prisma 生成器', status: 'fail', message: '❌ 缺失' });
  }
} else {
  addCheck({ name: 'Prisma Schema', status: 'fail', message: '❌ 未找到' });
}

// 检查 6: 部署配置
console.log('\n🚀 检查部署配置...');
if (fileExists('vercel.json') || fileExists('netlify.toml') || fileExists('railway.json')) {
  addCheck({ name: '部署配置', status: 'pass', message: '✅ 找到' });
} else {
  addCheck({ name: '部署配置', status: 'warn', message: '⚠️ 建议添加' });
}

// 输出结果
console.log('\n' + '='*60);
console.log('📊 检查结果汇总\n');

const passed = checks.filter(c => c.status === 'pass').length;
const failed = checks.filter(c => c.status === 'fail').length;
const warned = checks.filter(c => c.status === 'warn').length;

checks.forEach(check => {
  const icon = check.status === 'pass' ? '✅' : check.status === 'fail' ? '❌' : '⚠️';
  console.log(`${icon} ${check.name.padEnd(25)} - ${check.message}`);
});

console.log('\n' + '='*60);
console.log(`\n📈 统计: ${passed} 通过 | ${warned} 警告 | ${failed} 失败\n`);

// 计算就绪度
const total = checks.length;
const readiness = Math.round((passed / total) * 100);

if (failed === 0) {
  console.log(`🎉 部署就绪度: ${readiness}%\n`);
  if (warned > 0) {
    console.log('⚠️ 有 ${warned} 项警告,建议在部署前修复\n');
  }
  process.exit(0);
} else {
  console.log(`❌ 部署就绪度: ${readiness}%\n`);
  console.log('🔴 必须修复以下问题才能部署:\n');
  checks
    .filter(c => c.status === 'fail')
    .forEach(check => {
      console.log(`   • ${check.name}: ${check.message}`);
    });
  console.log();
  process.exit(1);
}
