import { cn } from "@/lib/utils"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
    return (
        <footer className={cn("border-t py-6 md:py-0", className)}>
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built by{" "}
                    <a
                        href="#"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                    >
                        SAKEfolio
                    </a>
                    .
                </p>
                <p className="text-center text-xs text-muted-foreground">
                    さけのわデータ (<a href="https://sakenowa.com" target="_blank" rel="noreferrer" className="underline underline-offset-4">https://sakenowa.com</a>) のデータを加工して利用しています。
                </p>
            </div>
        </footer>
    )
}
