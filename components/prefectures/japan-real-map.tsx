"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Japan from "@svg-maps/japan"
import { cn } from "@/lib/utils"
// We don't need react-svg-map css anymore, we can style manually

type Prefecture = {
    id: string
    code: string
    name: string
}

interface JapanRealMapProps {
    prefectures: Prefecture[]
    className?: string
}

export function JapanRealMap({ prefectures, className }: JapanRealMapProps) {
    const router = useRouter()
    const [hoveredLocationName, setHoveredLocationName] = useState<string | null>(null)
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

    const handleLocationClick = (event: React.MouseEvent<SVGPathElement>) => {
        const locationName = event.currentTarget.getAttribute("name")
        const pref = findPrefectureByName(locationName, prefectures)
        if (pref) {
            router.push(`/prefectures/${pref.code}`)
        }
    }

    const handleLocationMouseOver = (event: React.MouseEvent<SVGPathElement>) => {
        const name = event.currentTarget.getAttribute("name")
        setHoveredLocationName(name)
    }

    const handleLocationMouseMove = (event: React.MouseEvent<SVGPathElement>) => {
        setTooltipPos({ x: event.clientX, y: event.clientY })
    }

    const handleLocationMouseOut = () => {
        setHoveredLocationName(null)
    }

    const mainLocations = Japan.locations.filter((l: any) => l.id !== "okinawa" && l.id !== "hokkaido")
    const okinawaLocation = Japan.locations.find((l: any) => l.id === "okinawa")
    const hokkaidoLocation = Japan.locations.find((l: any) => l.id === "hokkaido")

    // Custom ViewBox for Main Map
    // Original: 0 0 438 516
    // Cut off Top (Hokkaido space) -> Start y=60 (Adds padding above Aomori ~125)
    // Cut off Bottom (Okinawa space) -> End y=430 (Kagoshima ends ~425)
    // Width maintained
    // Custom ViewBox for Main Map
    // Trimmed width to zoom in (approx 15 from left, 10 from right)
    // Trimmed top to reduce empty space above Aomori (started at 60 -> 70)
    const mainViewBox = "15 70 410 360"

    // Custom ViewBox for Okinawa Inset
    // Centered on main island (approx 85, 470)
    // Zoom level maintained (Width 50)
    const okinawaViewBox = "65 435 40 50"

    // Custom ViewBox for Hokkaido Inset
    // Hokkaido starts ~330, 71
    // Box roughly 290 40 160 120
    const hokkaidoViewBox = "300 10 150 90"

    return (
        <div className={cn("japan-real-map-container w-full h-full relative font-sans select-none", className)}>

            {/* Main Map (Honshu, Shikoku, Kyushu) */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={mainViewBox}
                className="w-full h-auto max-h-[700px] mx-auto"
                aria-label="Map of Japan (Main)"
            >
                {mainLocations.map((location: { id: string; name: string; path: string }) => {
                    const isHovered = hoveredLocationName === location.name
                    return (
                        <path
                            key={location.id}
                            id={location.id}
                            name={location.name}
                            d={location.path}
                            className={cn(
                                "stroke-gray-300 stroke-[1px] transition-all duration-200 cursor-pointer outline-none",
                                isHovered ? "fill-primary z-10" : "fill-white hover:fill-blue-50"
                            )}
                            onMouseEnter={handleLocationMouseOver}
                            onMouseMove={handleLocationMouseMove}
                            onMouseLeave={handleLocationMouseOut}
                            onClick={handleLocationClick}
                        />
                    )
                })}
            </svg>

            {/* Okinawa Inset (Bottom Right) */}
            {okinawaLocation && (
                <div className="absolute bottom-0 right-0 sm:bottom-2 sm:right-2 md:bottom-4 md:right-4 w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 border-l border-t border-gray-200 bg-white/95 shadow-sm rounded-tl-sm sm:rounded-sm overflow-hidden z-20">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox={okinawaViewBox}
                        className="w-full h-full p-1"
                        aria-label="Map of Okinawa"
                    >
                        <path
                            key={okinawaLocation.id}
                            id={okinawaLocation.id}
                            name={okinawaLocation.name}
                            d={okinawaLocation.path}
                            className={cn(
                                "stroke-gray-300 stroke-[1px] transition-all duration-200 cursor-pointer outline-none",
                                hoveredLocationName === okinawaLocation.name ? "fill-primary" : "fill-white hover:fill-blue-50"
                            )}
                            onMouseEnter={handleLocationMouseOver}
                            onMouseMove={handleLocationMouseMove}
                            onMouseLeave={handleLocationMouseOut}
                            onClick={handleLocationClick}
                        />
                    </svg>
                    <span className="absolute bottom-0.5 right-1 text-[10px] md:text-xs font-medium text-muted-foreground/80 bg-white/50 px-1 rounded">沖縄</span>
                </div>
            )}

            {/* Hokkaido Inset (Top Left) */}
            {hokkaidoLocation && (
                <div className="absolute top-0 left-0 sm:top-2 sm:left-2 md:top-4 md:left-4 w-24 h-24 sm:w-40 sm:h-40 md:w-56 md:h-56 border-r border-b border-gray-200 bg-white/95 shadow-sm rounded-br-sm sm:rounded-sm overflow-hidden z-20">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox={hokkaidoViewBox}
                        className="w-full h-full p-1"
                        aria-label="Map of Hokkaido"
                    >
                        <path
                            key={hokkaidoLocation.id}
                            id={hokkaidoLocation.id}
                            name={hokkaidoLocation.name}
                            d={hokkaidoLocation.path}
                            className={cn(
                                "stroke-gray-300 stroke-[1px] transition-all duration-200 cursor-pointer outline-none",
                                hoveredLocationName === hokkaidoLocation.name ? "fill-primary" : "fill-white hover:fill-blue-50"
                            )}
                            onMouseEnter={handleLocationMouseOver}
                            onMouseMove={handleLocationMouseMove}
                            onMouseLeave={handleLocationMouseOut}
                            onClick={handleLocationClick}
                        />
                    </svg>
                    <span className="absolute bottom-0.5 right-1 text-[10px] md:text-xs font-medium text-muted-foreground/80 bg-white/50 px-1 rounded">北海道</span>
                </div>
            )}

            {/* Tooltip */}
            {hoveredLocationName && (
                <div
                    className="fixed z-50 px-3 py-1.5 text-sm font-bold text-white bg-slate-800/90 rounded shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 backdrop-blur-sm whitespace-nowrap"
                    style={{
                        left: tooltipPos.x,
                        top: tooltipPos.y - 10,
                    }}
                >
                    {findPrefectureByName(hoveredLocationName, prefectures)?.name || hoveredLocationName}
                    <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-slate-800/90 transform -translate-x-1/2 rotate-45"></div>
                </div>
            )}
        </div>
    )
}

function findPrefectureByName(romanName: string | null, prefectures: Prefecture[]) {
    if (!romanName) return null
    // Clean up name: simply lowercase. The library uses "Aichi", "Fukuoka", "Tokyo" etc.
    const name = romanName.toLowerCase()

    // Manual mapping for library names to Kanji
    const ROMAN_MAP: Record<string, string> = {
        "hokkaido": "北海道", "aomori": "青森県", "iwate": "岩手県", "miyagi": "宮城県", "akita": "秋田県", "yamagata": "山形県", "fukushima": "福島県",
        "ibaraki": "茨城県", "tochigi": "栃木県", "gunma": "群馬県", "saitama": "埼玉県", "chiba": "千葉県", "tokyo": "東京都", "kanagawa": "神奈川県",
        "niigata": "新潟県", "toyama": "富山県", "ishikawa": "石川県", "fukui": "福井県", "yamanashi": "山梨県", "nagano": "長野県", "gifu": "岐阜県", "shizuoka": "静岡県", "aichi": "愛知県",
        "mie": "三重県", "shiga": "滋賀県", "kyoto": "京都府", "osaka": "大阪府", "hyogo": "兵庫県", "nara": "奈良県", "wakayama": "和歌山県",
        "tottori": "鳥取県", "shimane": "島根県", "okayama": "岡山県", "hiroshima": "広島県", "yamaguchi": "山口県",
        "tokushima": "徳島県", "kagawa": "香川県", "ehime": "愛媛県", "kochi": "高知県",
        "fukuoka": "福岡県", "saga": "佐賀県", "nagasaki": "長崎県", "kumamoto": "熊本県", "oita": "大分県", "miyazaki": "宮崎県", "kagoshima": "鹿児島県",
        "okinawa": "沖縄県"
    }

    const kanjiPart = ROMAN_MAP[name]
    if (kanjiPart) {
        return prefectures.find(p => p.name.includes(kanjiPart) || p.name === kanjiPart)
    }

    return null
}
