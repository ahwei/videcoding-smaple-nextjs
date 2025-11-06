import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

async function getNews() {
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        publishedAt: "desc",
      },
      take: 3, // 首頁只顯示最新 3 筆
    });
    return news;
  } catch (error) {
    console.error("取得最新消息失敗:", error);
    return [];
  }
}

export default async function Home() {
  const news = await getNews();

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950" />

        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-blue-400 blur-3xl" />
          <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-purple-400 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 text-center">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border bg-background/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium shadow-sm">
              <span className="text-muted-foreground">📚 培育未來領袖的搖籃</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                高雄科技大學
              </span>
            </h1>

            {/* Tagline */}
            <p className="mx-auto max-w-3xl text-xl font-medium text-foreground/90 sm:text-2xl md:text-3xl">
              創新思維 · 卓越研究 · 全球視野
            </p>

            {/* Description */}
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
              致力於培養具備國際競爭力的專業人才，結合理論與實務，
              打造創新學習環境，引領學生探索無限可能
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-lg">
                立即申請入學
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold">
                探索校園生活
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div className="space-y-2">
                <p className="text-3xl font-bold text-foreground sm:text-4xl">15,000+</p>
                <p className="text-sm text-muted-foreground">在校學生</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-foreground sm:text-4xl">8</p>
                <p className="text-sm text-muted-foreground">學院系所</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-foreground sm:text-4xl">500+</p>
                <p className="text-sm text-muted-foreground">專業師資</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-foreground sm:text-4xl">95%</p>
                <p className="text-sm text-muted-foreground">就業率</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground">向下探索更多</p>
            <svg
              className="h-6 w-6 text-muted-foreground"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="relative bg-background py-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              最新消息
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              掌握校園最新動態與重要公告
            </p>
          </div>

          {/* News Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.length > 0 ? (
              news.map((item) => (
                <Card key={item.id} className="flex flex-col transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 text-sm text-muted-foreground">
                      {new Date(item.publishedAt).toLocaleDateString("zh-TW", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription className="line-clamp-3 text-base">
                      {item.content.substring(0, 150)}...
                    </CardDescription>
                    <Button variant="link" className="mt-4 p-0 text-primary">
                      閱讀更多 →
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                目前沒有最新消息
              </div>
            )}
          </div>

          {/* View All Button */}
          {news.length > 0 && (
            <div className="mt-12 text-center">
              <Button size="lg" variant="outline">
                查看所有消息
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
