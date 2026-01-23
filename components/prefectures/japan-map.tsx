"use client"

import React from "react"
import Link from "next/link"
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
}

export function JapanMap({ prefectures }: JapanMapProps) {
    const getPref = (code: string) => prefectures.find((p) => String(p.code) === code)

    return (
        <div className="mx-auto max-w-5xl p-6 bg-white rounded-3xl min-h-[600px] relative overflow-hidden border">
            {/* Decorative elements */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: "url('/images/japan_map.png')",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            ></div>
            <div className="absolute top-10 right-10 text-9xl text-blue-100 font-serif select-none pointer-events-none opacity-50">JAPAN</div>

            <div className="hidden md:block relative w-full h-[600px]">
                {/* Hokkaido */}
                <MapNode pref={getPref("1")} x={85} y={5} size={12} className="bg-cyan-100 hover:bg-cyan-200" />

                {/* Tohoku */}
                <MapNode pref={getPref("2")} x={80} y={20} className="bg-blue-100 hover:bg-blue-200" /> {/* Aomori */}
                <MapNode pref={getPref("3")} x={82} y={26} className="bg-blue-100 hover:bg-blue-200" /> {/* Iwate */}
                <MapNode pref={getPref("5")} x={76} y={26} className="bg-blue-100 hover:bg-blue-200" /> {/* Akita */}
                <MapNode pref={getPref("4")} x={81} y={32} className="bg-blue-100 hover:bg-blue-200" /> {/* Miyagi */}
                <MapNode pref={getPref("6")} x={75} y={32} className="bg-blue-100 hover:bg-blue-200" /> {/* Yamagata */}
                <MapNode pref={getPref("7")} x={78} y={38} className="bg-blue-100 hover:bg-blue-200" /> {/* Fukushima */}

                {/* Kanto */}
                <MapNode pref={getPref("8")} x={78} y={44} className="bg-green-100 hover:bg-green-200" /> {/* Ibaraki */}
                <MapNode pref={getPref("9")} x={74} y={44} className="bg-green-100 hover:bg-green-200" /> {/* Tochigi */}
                <MapNode pref={getPref("10")} x={70} y={44} className="bg-green-100 hover:bg-green-200" /> {/* Gunma */}
                <MapNode pref={getPref("11")} x={71} y={50} className="bg-green-100 hover:bg-green-200" /> {/* Saitama */}
                <MapNode pref={getPref("12")} x={77} y={50} className="bg-green-100 hover:bg-green-200" /> {/* Chiba */}
                <MapNode pref={getPref("13")} x={71} y={56} className="bg-green-100 hover:bg-green-200 z-10" /> {/* Tokyo */}
                <MapNode pref={getPref("14")} x={70} y={60} className="bg-green-100 hover:bg-green-200" /> {/* Kanagawa */}

                {/* Chubu */}
                <MapNode pref={getPref("15")} x={65} y={40} className="bg-yellow-100 hover:bg-yellow-200" /> {/* Niigata */}
                <MapNode pref={getPref("16")} x={60} y={44} className="bg-yellow-100 hover:bg-yellow-200" /> {/* Toyama */}
                <MapNode pref={getPref("17")} x={56} y={40} className="bg-yellow-100 hover:bg-yellow-200" /> {/* Ishikawa */}
                <MapNode pref={getPref("18")} x={56} y={46} className="bg-yellow-100 hover:bg-yellow-200" /> {/* Fukui */}
                <MapNode pref={getPref("19")} x={66} y={54} className="bg-yellow-100 hover:bg-yellow-200" /> {/* Yamanashi */}
                <MapNode pref={getPref("20")} x={61} y={50} className="bg-yellow-100 hover:bg-yellow-200" /> {/* Nagano */}
                <MapNode pref={getPref("21")} x={58} y={54} className="bg-yellow-100 hover:bg-yellow-200" /> {/* Gifu */}
                <MapNode pref={getPref("22")} x={65} y={60} className="bg-yellow-100 hover:bg-yellow-200" /> {/* Shizuoka */}
                <MapNode pref={getPref("23")} x={59} y={60} className="bg-yellow-100 hover:bg-yellow-200" /> {/* Aichi */}

                {/* Kinki (Kansai) */}
                <MapNode pref={getPref("24")} x={53} y={60} className="bg-orange-100 hover:bg-orange-200" /> {/* Mie */}
                <MapNode pref={getPref("25")} x={49} y={56} className="bg-orange-100 hover:bg-orange-200" /> {/* Shiga */}
                <MapNode pref={getPref("26")} x={47} y={50} className="bg-orange-100 hover:bg-orange-200" /> {/* Kyoto */}
                <MapNode pref={getPref("27")} x={47} y={60} className="bg-orange-100 hover:bg-orange-200" /> {/* Osaka */}
                <MapNode pref={getPref("28")} x={42} y={56} className="bg-orange-100 hover:bg-orange-200" /> {/* Hyogo */}
                <MapNode pref={getPref("29")} x={48} y={66} className="bg-orange-100 hover:bg-orange-200" /> {/* Nara */}
                <MapNode pref={getPref("30")} x={43} y={66} className="bg-orange-100 hover:bg-orange-200" /> {/* Wakayama */}

                {/* Chugoku */}
                <MapNode pref={getPref("31")} x={36} y={52} className="bg-red-100 hover:bg-red-200" /> {/* Tottori */}
                <MapNode pref={getPref("32")} x={30} y={52} className="bg-red-100 hover:bg-red-200" /> {/* Shimane */}
                <MapNode pref={getPref("33")} x={36} y={58} className="bg-red-100 hover:bg-red-200" /> {/* Okayama */}
                <MapNode pref={getPref("34")} x={30} y={58} className="bg-red-100 hover:bg-red-200" /> {/* Hiroshima */}
                <MapNode pref={getPref("35")} x={24} y={56} className="bg-red-100 hover:bg-red-200" /> {/* Yamaguchi */}

                {/* Shikoku */}
                <MapNode pref={getPref("36")} x={38} y={70} className="bg-pink-100 hover:bg-pink-200" /> {/* Tokushima */}
                <MapNode pref={getPref("37")} x={32} y={68} className="bg-pink-100 hover:bg-pink-200" /> {/* Kagawa */}
                <MapNode pref={getPref("38")} x={28} y={72} className="bg-pink-100 hover:bg-pink-200" /> {/* Ehime */}
                <MapNode pref={getPref("39")} x={32} y={76} className="bg-pink-100 hover:bg-pink-200" /> {/* Kochi */}

                {/* Kyushu */}
                <MapNode pref={getPref("40")} x={18} y={60} className="bg-purple-100 hover:bg-purple-200" /> {/* Fukuoka */}
                <MapNode pref={getPref("41")} x={12} y={62} className="bg-purple-100 hover:bg-purple-200" /> {/* Saga */}
                <MapNode pref={getPref("42")} x={6} y={68} className="bg-purple-100 hover:bg-purple-200" /> {/* Nagasaki */}
                <MapNode pref={getPref("43")} x={16} y={70} className="bg-purple-100 hover:bg-purple-200" /> {/* Kumamoto */}
                <MapNode pref={getPref("44")} x={20} y={66} className="bg-purple-100 hover:bg-purple-200" /> {/* Oita */}
                <MapNode pref={getPref("45")} x={16} y={78} className="bg-purple-100 hover:bg-purple-200" /> {/* Miyazaki */}
                <MapNode pref={getPref("46")} x={10} y={80} className="bg-purple-100 hover:bg-purple-200" /> {/* Kagoshima */}

                {/* Okinawa */}
                <MapNode pref={getPref("47")} x={10} y={92} className="bg-purple-100 hover:bg-purple-200" /> {/* Okinawa */}

            </div>

            {/* Mobile Fallback */}
            <div className="md:hidden grid grid-cols-4 gap-2">
                {prefectures.map(pref => (
                    <Link
                        key={pref.code}
                        href={`/prefectures/${pref.code}`}
                        className="flex items-center justify-center p-2 text-xs rounded bg-white border shadow-sm"
                    >
                        {pref.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}

function MapNode({ pref, x, y, size = 5, className }: { pref?: Prefecture, x: number, y: number, size?: number, className?: string }) {
    if (!pref) return null
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={`/prefectures/${pref.code}`}
                        className={cn(
                            "absolute flex items-center justify-center rounded-md shadow-sm border border-black/5 text-xs font-bold transition-all hover:scale-110 hover:shadow-md hover:z-50",
                            className
                        )}
                        style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            width: `${size}%`,
                            height: "4%", // Fixed height percentage
                        }}
                    >
                        <span className="truncate px-0.5 text-[0.7rem] sm:text-xs">{pref.name}</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{pref.name}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
