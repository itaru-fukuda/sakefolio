"use client"

import * as React from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JapanRealMap } from "./japan-real-map"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutGrid, Map as MapIcon } from "lucide-react"

type Prefecture = {
    id: string
    code: string
    name: string
}

interface PrefectureSelectorProps {
    prefectures: Prefecture[]
}

const REGIONS = [
    { name: "北海道・東北", codes: ["01", "02", "03", "04", "05", "06", "07"] },
    { name: "関東", codes: ["08", "09", "10", "11", "12", "13", "14"] },
    { name: "中部", codes: ["15", "16", "17", "18", "19", "20", "21", "22", "23"] },
    { name: "近畿", codes: ["24", "25", "26", "27", "28", "29", "30"] },
    { name: "中国", codes: ["31", "32", "33", "34", "35"] },
    { name: "四国", codes: ["36", "37", "38", "39"] },
    { name: "九州・沖縄", codes: ["40", "41", "42", "43", "44", "45", "46", "47"] },
]

export function PrefectureSelector({ prefectures }: PrefectureSelectorProps) {
    return (
        <Tabs defaultValue="map" className="w-full">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold font-serif">都道府県から探す</h1>
                <TabsList>
                    <TabsTrigger value="map" className="flex items-center gap-2">
                        <MapIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">地図で探す</span>
                    </TabsTrigger>
                    <TabsTrigger value="list" className="flex items-center gap-2">
                        <LayoutGrid className="h-4 w-4" />
                        <span className="hidden sm:inline">リストで探す</span>
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="map" className="mt-0">
                <div className="mx-auto max-w-4xl bg-blue-50/30 rounded-3xl p-6 border">
                    <JapanRealMap prefectures={prefectures} />
                </div>
            </TabsContent>

            <TabsContent value="list" className="mt-0 space-y-12">
                {REGIONS.map((region) => {
                    const regionPrefectures = prefectures?.filter(p => region.codes.includes(p.code))
                    if (!regionPrefectures || regionPrefectures.length === 0) return null

                    return (
                        <div key={region.name}>
                            <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-primary/20 inline-block text-primary">
                                {region.name}
                            </h2>
                            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                {regionPrefectures.map((pref) => (
                                    <Link key={pref.code} href={`/prefectures/${pref.code}`}>
                                        <Card className="h-full transition-colors hover:bg-muted/50">
                                            <CardHeader className="p-4 text-center">
                                                <CardTitle className="text-lg">{pref.name}</CardTitle>
                                            </CardHeader>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </TabsContent>
        </Tabs>
    )
}
