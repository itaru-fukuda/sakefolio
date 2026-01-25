import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, MapPin, TrendingUp, BookOpen, ChevronRight } from "lucide-react"
import { GlobalSearch } from "@/components/global-search"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Editorial Hero Section */}
      <section
        className="relative py-24 md:py-36 bg-cover bg-center border-b border-border/50"
        style={{ backgroundImage: "url('/images/sake_hero_bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
          <span className="text-sm font-medium tracking-widest text-white/90 uppercase mb-4 inline-block drop-shadow-md">
            Japanese Sake Log
          </span>
          <h1 className="mb-6 text-4xl font-serif font-bold text-white md:text-6xl tracking-wide leading-tight drop-shadow-lg">
            Sakefolio
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 font-light leading-relaxed font-serif drop-shadow-md">
            至高の一杯を、美しく記録する。<br className="hidden md:inline" />
            日々の感動を、確かな記憶へ。
          </p>

          <div className="mx-auto max-w-lg mb-12">
            <GlobalSearch />
          </div>

          <div className="flex justify-center flex-wrap gap-4">
            <Button asChild size="lg" className="rounded-sm px-8 font-serif font-normal bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/logs/new">
                <span>ログを記録する</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-sm px-8 font-serif font-normal border-foreground/20 hover:bg-accent hover:text-accent-foreground">
              <Link href="/logs">
                <span>記録一覧へ</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content - Column Layout */}
      <div className="flex-1 container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Main Column - Browse & Discovery */}
          <div className="md:col-span-8 flex flex-col gap-12">
            <section>
              <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                <h2 className="text-2xl font-serif font-bold tracking-wide">探す・見つける</h2>
                <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-serif">
                  すべて見る &rarr;
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Prefecture Card */}
                <Link href="/prefectures" className="group block h-full">
                  <div className="relative h-64 overflow-hidden rounded-sm bg-muted">
                    {/* Abstract Pattern or Image */}
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_25%,rgba(0,0,0,0.02)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.02)_75%,rgba(0,0,0,0.02)_100%)] bg-[length:20px_20px]"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-transform group-hover:scale-105 duration-500">
                      <MapPin className="h-8 w-8 mb-4 text-foreground/80" strokeWidth={1.5} />
                      <h3 className="text-xl font-serif font-medium mb-2">産地から探す</h3>
                      <p className="text-sm text-muted-foreground font-light">
                        北は北海道から南は沖縄まで。<br />風土が生んだ味わいを巡る旅へ。
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Search Card (Replaced Rankings) */}
                <Link href="/logs/search" className="group block h-full">
                  <div className="relative h-64 overflow-hidden rounded-sm bg-muted">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-transform group-hover:scale-105 duration-500">
                      <Search className="h-8 w-8 mb-4 text-foreground/80" strokeWidth={1.5} />
                      <h3 className="text-xl font-serif font-medium mb-2">詳細検索</h3>
                      <p className="text-sm text-muted-foreground font-light">
                        味や度数、キーワードで記録を検索。<br />あの日の感動を呼び覚ます。
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="md:col-span-4 flex flex-col gap-8">
            <Card className="rounded-sm border-none shadow-sm bg-muted/30">
              <CardHeader>
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Sakefolioについて
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                Sakefolioは、あなたの日本酒ライフを豊かにするための記録ツールです。
                飲んだ銘柄の感想や評価を記録し、あなただけの酒蔵を築きましょう。
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
