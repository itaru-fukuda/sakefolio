"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type Prefecture = {
    id: string
    code: string
    name: string
}

interface JapanMapProps {
    prefectures: Prefecture[]
    className?: string
}

// Simplified Paths for Japan Prefectures
// Note: These are approximated paths for a recognizable shape.
const PREF_PATHS: Record<string, string> = {
    "1": "M780,50 L850,20 L940,60 L920,130 L850,150 L770,120 Z", // Hokkaido
    "2": "M770,140 L840,160 L840,190 L760,190 Z", // Aomori
    "3": "M790,200 L840,200 L830,260 L790,250 Z", // Iwate
    "4": "M790,260 L830,270 L820,310 L780,300 Z", // Miyagi
    "5": "M740,200 L780,200 L780,250 L740,240 Z", // Akita
    "6": "M730,250 L770,260 L770,300 L730,290 Z", // Yamagata
    "7": "M770,310 L810,320 L800,360 L760,350 Z", // Fukushima

    "8": "M790,370 L830,380 L820,410 L790,400 Z", // Ibaraki
    "9": "M750,370 L780,370 L780,400 L750,390 Z", // Tochigi
    "10": "M710,370 L740,370 L740,400 L710,390 Z", // Gunma
    "11": "M740,410 L780,410 L770,430 L740,430 Z", // Saitama
    "12": "M780,420 L820,420 L810,480 L780,450 Z", // Chiba
    "13": "M740,440 L760,440 L760,450 L740,450 Z", // Tokyo
    "14": "M730,450 L760,450 L750,470 L730,460 Z", // Kanagawa

    "15": "M680,330 L720,340 L700,380 L660,370 Z", // Niigata
    "16": "M640,360 L670,360 L670,390 L640,390 Z", // Toyama
    "17": "M610,350 L630,350 L630,380 L610,400 Z", // Ishikawa
    "18": "M610,410 L640,410 L630,440 L600,430 Z", // Fukui
    "19": "M700,410 L730,410 L720,440 L690,440 Z", // Yamanashi
    "20": "M660,390 L690,390 L690,440 L650,430 Z", // Nagano
    "21": "M630,400 L660,400 L650,450 L620,440 Z", // Gifu
    "22": "M680,450 L720,460 L710,490 L670,480 Z", // Shizuoka
    "23": "M630,450 L660,460 L650,490 L620,480 Z", // Aichi

    "24": "M600,460 L630,460 L620,510 L590,500 Z", // Mie
    "25": "M590,430 L620,430 L610,460 L580,450 Z", // Shiga
    "26": "M560,410 L590,420 L580,450 L560,440 Z", // Kyoto
    "27": "M550,450 L580,450 L570,470 L550,470 Z", // Osaka
    "28": "M510,420 L550,420 L540,460 L500,450 Z", // Hyogo
    "29": "M580,470 L610,470 L600,510 L570,500 Z", // Nara
    "30": "M550,480 L590,490 L580,540 L540,520 Z", // Wakayama

    "31": "M460,420 L500,420 L490,450 L450,440 Z", // Tottori
    "32": "M410,430 L450,430 L440,460 L400,460 Z", // Shimane
    "33": "M460,450 L500,450 L490,480 L450,480 Z", // Okayama
    "34": "M420,470 L460,470 L450,500 L410,500 Z", // Hiroshima
    "35": "M370,460 L410,460 L400,490 L360,490 Z", // Yamaguchi

    "36": "M460,510 L500,510 L490,540 L450,540 Z", // Tokushima
    "37": "M460,490 L500,490 L490,510 L450,510 Z", // Kagawa
    "38": "M410,500 L450,500 L440,540 L400,530 Z", // Ehime
    "39": "M410,540 L460,540 L450,570 L400,570 Z", // Kochi

    "40": "M310,480 L350,480 L340,510 L300,510 Z", // Fukuoka
    "41": "M280,490 L310,490 L310,520 L280,520 Z", // Saga
    "42": "M260,500 L290,500 L290,540 L260,540 Z", // Nagasaki
    "43": "M300,520 L340,520 L330,560 L290,550 Z", // Kumamoto
    "44": "M340,510 L380,510 L370,550 L330,550 Z", // Oita
    "45": "M330,560 L370,560 L360,600 L320,600 Z", // Miyazaki
    "46": "M280,560 L320,560 L310,610 L270,600 Z", // Kagoshima

    "47": "M150,750 L250,700 L230,750 L130,800 Z", // Okinawa (Shifted)
}

export function JapanSvgMap({ prefectures, className }: JapanMapProps) {
    const router = useRouter()
    const [hoveredPref, setHoveredPref] = useState<string | null>(null)

    const handleClick = (code: string) => {
        router.push(`/prefectures/${code}`)
    }

    const getPrefName = (code: string) => prefectures.find(p => String(p.code) === code)?.name || ""

    return (
        <div className={cn("w-full h-full relative", className)}>
            <svg viewBox="0 0 1000 900" className="w-full h-auto drop-shadow-xl filter">
                {/* Defs for gradients/filters */}
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Render Paths */}
                {Object.entries(PREF_PATHS).map(([code, path]) => {
                    const isHovered = hoveredPref === code

                    // Region coloring logic could go here
                    const regionColor = "fill-white"

                    return (
                        <TooltipProvider key={code}>
                            <Tooltip open={isHovered}>
                                <TooltipTrigger asChild>
                                    <path
                                        d={path}
                                        className={cn(
                                            "stroke-gray-300 stroke-[2px] transition-all duration-200 cursor-pointer hover:z-10",
                                            isHovered ? "fill-primary stroke-primary scale-105" : "fill-white hover:fill-blue-50"
                                        )}
                                        style={{
                                            transformOrigin: "center", // Note: SVG transform origin is tricky without precise centers
                                        }}
                                        onMouseEnter={() => setHoveredPref(code)}
                                        onMouseLeave={() => setHoveredPref(null)}
                                        onClick={() => handleClick(code)}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    {getPrefName(code)}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )
                })}
            </svg>
            {/* Instruction Overlay */}
            <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-white/80 p-2 rounded backdrop-blur">
                地図をクリックして選択
            </div>
        </div>
    )
}
