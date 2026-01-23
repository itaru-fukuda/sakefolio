import { z } from "zod"

export const LoginSchema = z.object({
    email: z.string().email({ message: "メールアドレスの形式が正しくありません" }),
    password: z.string().min(6, { message: "パスワードは6文字以上で入力してください" }),
})

export const SignupSchema = z.object({
    email: z.string().email({ message: "メールアドレスの形式が正しくありません" }),
    password: z.string().min(6, { message: "パスワードは6文字以上で入力してください" }),
    display_name: z.string().min(2, { message: "表示名は2文字以上で入力してください" }).optional(),
})
