-- Add category column to sakenowa_flavor_tags
ALTER TABLE public.sakenowa_flavor_tags ADD COLUMN IF NOT EXISTS category text;

-- Optional: Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_sakenowa_flavor_tags_category ON public.sakenowa_flavor_tags(category);

-- Seed some initial categories based on common keywords (Best effort)
-- Aroma (Happy/Fruity/Floral)
UPDATE public.sakenowa_flavor_tags SET category = 'Aroma' WHERE tag IN ('華やか', 'フルーティ', 'メロン', 'バナナ', 'リンゴ', '梨', '柑橘', 'ブドウ', 'イチゴ', 'ライチ', 'マスカット', 'パイナップル', '洋梨', '白桃', '桃', '桜', '花', 'アロマ');

-- Taste (Sweet/Dry/Acid/Umami)
UPDATE public.sakenowa_flavor_tags SET category = 'Taste' WHERE tag IN ('甘味', '酸味', '辛口', '旨味', '苦味', '渋味', '甘酸っぱい', 'ジューシー', '濃厚', '淡麗', 'コク', 'キレ', '複雑', '芳醇', '濃醇');

-- Texture/Feeling
UPDATE public.sakenowa_flavor_tags SET category = 'Texture' WHERE tag IN ('発泡', 'ガス', '微発泡', 'フレッシュ', 'なめらか', '透明感', 'とろみ', '余韻', '水', '綺麗');

-- Others/Aging
UPDATE public.sakenowa_flavor_tags SET category = 'Other' WHERE tag IN ('熟成', '古酒', '木', '土', '穀物', 'ヨーグルト', '乳酸', 'チーズ', 'ナッツ', 'チョコ', 'キャラメル', 'バニラ');
