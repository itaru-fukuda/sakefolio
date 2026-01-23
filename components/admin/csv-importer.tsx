"use client"

import { useState } from "react"
import Papa from "papaparse"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { importProRatings } from "@/lib/actions/admin"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function CsvImporter() {
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [result, setResult] = useState<{ successCount: number; errorCount: number; errors: string[] } | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
            setResult(null)
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setIsUploading(true)

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const rows = results.data as any[]
                // Validate basic structure or trust server validation
                // Call Server Action
                try {
                    // Chunking might be needed for large files, but for now send all
                    const response = await importProRatings(rows)
                    if (response.error) {
                        toast.error(response.error)
                    } else {
                        setResult(response as any)
                        if (response.errorCount === 0) {
                            toast.success(`${response.successCount}件インポートしました`)
                        } else {
                            toast.warning(`${response.successCount}件成功、${response.errorCount}件失敗`)
                        }
                    }
                } catch (error) {
                    toast.error("インポート中にエラーが発生しました")
                    console.error(error)
                } finally {
                    setIsUploading(false)
                }
            },
            error: (error) => {
                toast.error("CSV解析エラー: " + error.message)
                setIsUploading(false)
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex w-full max-w-sm items-center space-x-2">
                <Input type="file" accept=".csv" onChange={handleFileChange} disabled={isUploading} />
                <Button onClick={handleUpload} disabled={!file || isUploading}>
                    {isUploading ? "インポート中..." : "インポート"}
                </Button>
            </div>

            <div className="text-sm text-muted-foreground p-4 border rounded-md">
                <p className="font-bold mb-2">CSVフォーマット列名 (ヘッダー必須):</p>
                <code>
                    variant_name, brand_name, brewery_name, prefecture_name, source_name, score, score_max, reference_url, published_at, note
                </code>
            </div>

            {result && (
                <div className="space-y-4">
                    <Alert variant={result.errorCount > 0 ? "destructive" : "default"} className={result.errorCount === 0 ? "border-green-500 text-green-500" : ""}>
                        {result.errorCount === 0 ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        <AlertTitle>インポート結果</AlertTitle>
                        <AlertDescription>
                            成功: {result.successCount}件 / 失敗: {result.errorCount}件
                        </AlertDescription>
                    </Alert>

                    {result.errors.length > 0 && (
                        <div className="max-h-60 overflow-y-auto border rounded p-2 text-xs bg-muted">
                            {result.errors.map((err, i) => (
                                <div key={i} className="text-destructive border-b border-destructive/10 last:border-0 py-1">
                                    {err}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
