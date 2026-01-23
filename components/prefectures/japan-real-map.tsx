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

    return (
        <div className={cn("japan-svg-map-container w-full h-full relative cursor-default", className)}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={Japan.viewBox}
                className="w-full h-auto"
                aria-label={Japan.label}
            >
                {Japan.locations.map((location) => {
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

            {hoveredLocationName && (
                <div
                    className="fixed z-50 px-3 py-1.5 text-sm font-bold text-white bg-slate-800/90 rounded shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 backdrop-blur-sm whitespace-nowrap"
                    style={{
                        left: tooltipPos.x,
                        top: tooltipPos.y - 10, // Slight offset above cursor
                    }}
                >
                    {findPrefectureByName(hoveredLocationName, prefectures)?.name || hoveredLocationName}
                    {/* Tiny triangle for speech bubble effect */}
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
