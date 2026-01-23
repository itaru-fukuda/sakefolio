import { CsvImporter } from "@/components/admin/csv-importer"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ImportPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <Button variant="ghost" asChild className="pl-0 hover:bg-transparent mb-6">
                <Link href="/app/admin" className="flex items-center text-muted-foreground hover:text-primary">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    管理画面に戻る
                </Link>
            </Button>

            <h1 className="text-2xl font-bold mb-6">プロ評価CSVインポート</h1>
            <CsvImporter />
        </div>
    )
}
