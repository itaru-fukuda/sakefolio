"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Share, Download } from "lucide-react"
import { cn } from "@/lib/utils"

export function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsStandalone(window.matchMedia("(display-mode: standalone)").matches)

        const userAgent = window.navigator.userAgent.toLowerCase()
        setIsIOS(/iphone|ipad|ipod/.test(userAgent))

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setIsVisible(true)
        }

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

        // Show manual prompt for iOS if not standalone
        if (/iphone|ipad|ipod/.test(userAgent) && !window.matchMedia("(display-mode: standalone)").matches) {
            // Delay showing the prompt slightly
            setTimeout(() => setIsVisible(true), 2000)
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
        }
    }, [])

    const handleInstallClick = async () => {
        if (!deferredPrompt) return

        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === "accepted") {
            setDeferredPrompt(null)
            setIsVisible(false)
        }
    }

    if (isStandalone || !isVisible) return null

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-500">
            <div className="rounded-lg bg-card p-4 shadow-lg border border-border flex flex-col gap-3 relative">
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-foreground p-1"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-3 pr-6">
                    <div className="bg-primary/10 p-2 rounded-md">
                        <Download className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">ホーム画面に追加</h3>
                        <p className="text-xs text-muted-foreground">アプリとしてインストールすると、より快適に利用できます。</p>
                    </div>
                </div>

                {isIOS ? (
                    <div className="text-sm bg-muted/50 p-3 rounded text-muted-foreground mt-1">
                        <p className="flex items-center gap-2 mb-1">
                            1. 画面下部の <Share className="h-4 w-4" /> (シェア) をタップ
                        </p>
                        <p>2. 「ホーム画面に追加」を選択</p>
                    </div>
                ) : (
                    <Button onClick={handleInstallClick} className="w-full mt-1" size="sm">
                        インストールする
                    </Button>
                )}
            </div>
        </div>
    )
}
