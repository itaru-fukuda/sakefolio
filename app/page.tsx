import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, MapPin, TrendingUp, BookOpen, ChevronRight, Building2 } from "lucide-react"
import { GlobalSearch } from "@/components/global-search"
import { HomeTimeline } from "@/components/home-timeline"
import { Suspense } from "react"

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Editorial Hero Section */}
      <section
        className="relative py-24 md:py-36 bg-cover bg-center border-b border-border/50"
        style={{ backgroundImage: "url('/images/sake_hero_bg.png')" }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "SAKEfolio",
              "applicationCategory": "LifestyleApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "JPY"
              },
              "description": "SAKEfolio（サケフォリオ）は、あなたの日本酒ライフを豊かにするための記録ツールです。",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "100"
              }
            }),
          }}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
          <span className="text-sm font-medium tracking-widest text-white/90 uppercase mb-4 inline-block drop-shadow-md">
            Japanese Sake Log
          </span>
          <h1 className="mb-6 text-4xl font-serif font-bold text-white md:text-6xl tracking-wide leading-tight drop-shadow-lg">
            SAKEfolio
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Prefecture Card */}
                <Link href="/prefectures" className="group block h-full">
                  <div className="relative h-64 overflow-hidden rounded-sm bg-muted shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] active:brightness-90">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/images/nav_card_region_nature.png')" }}></div>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center relative z-10">
                      <MapPin className="h-8 w-8 mb-4 text-white/90 drop-shadow-md" strokeWidth={1.5} />
                      <h3 className="text-xl font-serif font-medium mb-2 text-white drop-shadow-md">産地から探す</h3>
                      <p className="text-sm text-white/80 font-light drop-shadow-sm">
                        日本各地、風土の味わいを<br />巡る旅へ。
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Brewery Card */}
                <Link href="/breweries" className="group block h-full">
                  <div className="relative h-64 overflow-hidden rounded-sm bg-muted shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] active:brightness-90">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/images/nav_card_brewery.png')" }}></div>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center relative z-10">
                      <Building2 className="h-8 w-8 mb-4 text-white/90 drop-shadow-md" strokeWidth={1.5} />
                      <h3 className="text-xl font-serif font-medium mb-2 text-white drop-shadow-md">酒造から探す</h3>
                      <p className="text-sm text-white/80 font-light drop-shadow-sm">
                        老舗から新鋭まで、<br />作り手の想いを。
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Search Card */}
                <Link href="/logs/search" className="group block h-full">
                  <div className="relative h-64 overflow-hidden rounded-sm bg-muted shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] active:brightness-90">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('/images/nav_card_search.png')" }}></div>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center relative z-10">
                      <Search className="h-8 w-8 mb-4 text-white/90 drop-shadow-md" strokeWidth={1.5} />
                      <h3 className="text-xl font-serif font-medium mb-2 text-white drop-shadow-md">詳細検索</h3>
                      <p className="text-sm text-white/80 font-light drop-shadow-sm">
                        味やキーワードで検索し、  <br />まだ見ぬ出会いへ。
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="md:col-span-4 flex flex-col gap-8">
            <Suspense fallback={null}>
              <HomeTimeline compact={true} />
            </Suspense>
          </div>

        </div>

        {/* About Section - Moved to Bottom */}
        <div className="mt-20 border-t border-border pt-12">
          <Card className="rounded-sm border-none shadow-sm bg-muted/30 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="font-serif text-lg flex items-center gap-2 justify-center">
                <BookOpen className="h-4 w-4" /> SAKEfolioについて
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed text-center">
              SAKEfolio(サケフォリオ)は、あなたの日本酒ライフを豊かにするための記録ツールです。<br></br>
              飲んだ銘柄の感想や評価を記録し、あなただけの日本酒ポートフォリオを作成しましょう。
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
