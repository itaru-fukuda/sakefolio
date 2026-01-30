import { z } from "zod"

export const DrinkLogSchema = z.object({
    variant_id: z.string().uuid({ message: "銘柄を選択してください" }),
    drank_on: z.date().nullable().optional(),
    rating: z.number().int().min(1).max(10),
    impression: z.string().optional(),
    aroma: z.string().optional(),
    taste: z.string().optional(),
    feature: z.string().optional(),
    texture: z.string().optional(),
    temperature: z.string().optional(),
    is_public: z.boolean(),
    type: z.string().optional(),
    date_unknown: z.boolean().optional(),
}).refine((data) => data.drank_on || data.date_unknown, {
    message: "日付を入力するか、不明を選択してください",
    path: ["drank_on"],
})
