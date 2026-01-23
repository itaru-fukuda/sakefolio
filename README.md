# Sakefolio - 日本酒記録アプリ

Next.js + Supabase + TailwindCSS で構築された日本酒の評価・記録アプリです。

## 技術スタック

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS, shadcn/ui
- **Database**: Supabase (Postgres)
- **Auth**: Supabase Auth (Email + Password)

## セットアップ手順

### 1. Supabase プロジェクトの作成
Supabase で新規プロジェクトを作成してください。

### 2. 環境変数の設定
`.env.local` ファイルを作成し、以下の値を設定してください。
※ `SUPABASE_SERVICE_ROLE_KEY` はローカル開発での管理者操作にのみ使用し、Vercelには設定しないでください（推奨）。

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. データベースのセットアップ

SupabaseのSQLエディタで、`supabase/migrations` と `supabase/seed.sql` の内容を実行してください。

1. `supabase/migrations/20260122140000_init_schema.sql` (テーブル作成)
2. `supabase/migrations/20260122140001_views.sql` (ビュー作成)
3. `supabase/migrations/20260122140002_rls.sql` (RLS設定)
4. `supabase/seed.sql` (初期データ投入)

### 4. ローカル起動

```bash
npm install
npm run dev
```

http://localhost:3000 にアクセスしてください。

## デプロイ (Vercel)

1. GitHub にプッシュする
2. Vercel で新規プロジェクトを作成し、リポジトリをインポートする
3. Environment Variables に以下を設定する
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## 管理者権限の設定
ユーザー登録後、Supabaseのテーブルエディタで `profiles` テーブルを開き、対象ユーザーの `role` を `admin` に変更してください。
これで管理者ページ（`/app/admin` ※未実装の場合は直接DB操作）へのアクセス権限が付与されるロジックが有効になります。
