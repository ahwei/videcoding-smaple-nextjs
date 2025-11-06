import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        publishedAt: "desc",
      },
      take: 10, // 只取最新的 10 筆
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("取得最新消息失敗:", error);
    return NextResponse.json(
      { error: "無法取得最新消息" },
      { status: 500 }
    );
  }
}
