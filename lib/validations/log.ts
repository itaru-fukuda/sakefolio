import { z } from "zod"

export const DrinkLogSchema = z.object({
    variant_id: z.string().uuid({ message: "銘柄を選択してください" }),
    drank_on: z.date(),
    rating: z.number().int().min(1).max(10),
    impression: z.string().optional(),
    aroma: z.string().optional(),
    taste: z.string().optional(),
    is_public: z.boolean(),
})
