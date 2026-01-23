import * as z from "zod"

export const SakeRegistrationSchema = z.object({
    breweryName: z
        .string()
        .min(1, { message: "酒蔵名は必須です。" })
        .max(50, { message: "酒蔵名は50文字以内で入力してください。" }),
    prefectureCode: z
        .string()
        .length(2, { message: "都道府県を選択してください。" })
        .optional()
        .or(z.literal("")), // Optional because it's only required for NEW breweries but UI logic handles that. Zod could refine this.
    brandName: z
        .string()
        .min(1, { message: "銘柄名は必須です。" })
        .max(50, { message: "銘柄名は50文字以内で入力してください。" }),
    variantName: z
        .string()
        .min(1, { message: "種類・特定名称は必須です。" })
        .max(50, { message: "種類名は50文字以内で入力してください。" }),
    // Optional: Specific variant details if we want to expand later (abv, polishing ratio etc)
})
    .refine((data) => {
        // Ideally we want to say: If breweryName is NEW (not in list), then prefectureCode is required.
        // But client-side knows if it's new. Server-side check might need DB access or just always require it if we don't send ID?
        // Let's keep it simple: Validate prefectureCode is present if provided.
        // Logic will be handled in Server Action: Check if brewery exists. If NOT, require prefectureCode.
        return true
    })
