-- Update Flavor Tag Categories

-- 1. Aroma (Fruits, Sweet smells, Specific scents)
UPDATE public.sakenowa_flavor_tags SET category = 'Aroma' WHERE tag IN (
  'レーズン', 'グレープフルーツ', 'ラムネ', 'チョコレート', 'カラメル', '蜜', 'ハチミツ', '紹興酒', 
  'セメダイン', '飴', '果物', '香ばしい', '砂糖', '醤油', 'コーヒー', 'ヤクルト', 'オレンジ', 
  'プラム', '栗', 'いちご', '芳香', 'シャンパン', 'レモン', 'カルピス', 'トロピカル', 'プルーン', 
  'ラム', 'スモーキー', 'ハーブ', 'スパイス', 'スパイシー'
);

-- 2. Taste (Basic tastes, Balance, Impressions)
UPDATE public.sakenowa_flavor_tags SET category = 'Taste' WHERE tag IN (
  'スッキリ', 'しっかり', '優しい', '淡い', '薄い', 'ふくよか', '力強い', '落ち着く', '安定', '豊か', 
  'あっさり', '厚み', 'どっしり', '重い', '心地よい', 'アミノ酸', 'じわじわ', 'ジュース', '若い', 
  '控えめ', '深み', '渋み', '甘辛い', 'マイルド', '上品', '荒々しい', 'こってり', '派手', '鮮烈', 
  '昔ながら', '味噌', '清涼', '爽快', 'バランス', 'さっぱり', 'ほのか', 'まったり', 'クリーミー'
);

-- 3. Texture (Mouthfeel, Finish)
UPDATE public.sakenowa_flavor_tags SET category = 'Texture' WHERE tag IN (
  '柔らかい', 'さらり', 'ツン', 'さわやか', 'ふんわり', '軽快', 'みずみずしい', 'スイスイ', 'シャープ', 
  'するする', '硬い', 'ちびちび', '円やか', '丸み', 'グイグイ', 'ふっくら', 'ピチピチ', 'プチプチ', 
  'ひろがる', '透き通る', 'ずっしり', 'ゴクゴク', 'ピリリ', 'キリリ', 'じっくり'
);

-- 4. Temperature (Serving styles)
-- New Category: Temperature
UPDATE public.sakenowa_flavor_tags SET category = 'Temperature' WHERE tag IN (
  '常温', '熱燗', '燗酒', '冷酒', '燗冷まし'
);
