-- Prefectures (Master Data)
insert into public.prefectures (code, name) values
('01', '北海道'), ('02', '青森県'), ('03', '岩手県'), ('04', '宮城県'), ('05', '秋田県'),
('06', '山形県'), ('07', '福島県'), ('08', '茨城県'), ('09', '栃木県'), ('10', '群馬県'),
('11', '埼玉県'), ('12', '千葉県'), ('13', '東京都'), ('14', '神奈川県'), ('15', '新潟県'),
('16', '富山県'), ('17', '石川県'), ('18', '福井県'), ('19', '山梨県'), ('20', '長野県'),
('21', '岐阜県'), ('22', '静岡県'), ('23', '愛知県'), ('24', '三重県'), ('25', '滋賀県'),
('26', '京都府'), ('27', '大阪府'), ('28', '兵庫県'), ('29', '奈良県'), ('30', '和歌山県'),
('31', '鳥取県'), ('32', '島根県'), ('33', '岡山県'), ('34', '広島県'), ('35', '山口県'),
('36', '徳島県'), ('37', '香川県'), ('38', '愛媛県'), ('39', '高知県'), ('40', '福岡県'),
('41', '佐賀県'), ('42', '長崎県'), ('43', '熊本県'), ('44', '大分県'), ('45', '宮崎県'),
('46', '鹿児島県'), ('47', '沖縄県')
on conflict (code) do nothing;

-- Sample Data (Famous Breweries & Brands)
DO $$
DECLARE
    -- Breweries
    aramasa_id uuid;
    jikon_id uuid;
    dassai_id uuid;
    juyondai_id uuid;
    hakkaisan_id uuid;
    kubota_id uuid;
    hiroki_id uuid;
    nabeshima_id uuid;
    denshu_id uuid;
    kazenomori_id uuid;
    kokuryu_id uuid;
    hououbiden_id uuid;
    
    -- Brands
    no6_id uuid;
    jikon_brand_id uuid;
    dassai_brand_id uuid;
    juyondai_brand_id uuid;
    hakkaisan_brand_id uuid;
    kubota_brand_id uuid;
    hiroki_brand_id uuid;
    nabeshima_brand_id uuid;
    denshu_brand_id uuid;
    kazenomori_brand_id uuid;
    kokuryu_brand_id uuid;
    hououbiden_brand_id uuid;
BEGIN
    -- 1. Insert Breweries
    INSERT INTO public.breweries (name, prefecture_code, description) VALUES ('新政酒造', '05', '秋田県。「No.6」「陽乃鳥」など革新的な酒造り。6号酵母発祥の蔵。') RETURNING id INTO aramasa_id;
    INSERT INTO public.breweries (name, prefecture_code, description) VALUES ('木屋正酒造', '24', '三重県。2005年に「而今」を発表し大ヒット。') RETURNING id INTO jikon_id;
    INSERT INTO public.breweries (name, prefecture_code, description) VALUES ('旭酒造', '35', '山口県。「獺祭」のみを醸造する純米大吟醸専門の蔵。') RETURNING id INTO dassai_id;
    INSERT INTO public.breweries (name, prefecture_code, description) VALUES ('高木酒造', '06', '山形県。伝説的な銘柄「十四代」を生み出した蔵。') RETURNING id INTO juyondai_id;
    INSERT INTO public.breweries (name, prefecture_code, description) VALUES ('八海醸造', '15', '新潟県。淡麗辛口を代表する「八海山」。') RETURNING id INTO hakkaisan_id;
    INSERT INTO public.breweries (name, prefecture_code, description) VALUES ('朝日酒造', '15', '新潟県。「久保田」で知られる有力蔵。') RETURNING id INTO kubota_id;
    INSERT INTO public.breweries (name, prefecture_code, description) VALUES ('廣木酒造本店', '07', '福島県。「飛露喜」で無濾過生原酒ブームを牽引。') RETURNING id INTO hiroki_id;
    INSERT INTO public.breweries (name, prefecture_code, description) VALUES ('富久千代酒造', '41', '佐賀県。「鍋島」がIWCチャンピオンサケを受賞。') RETURNING id INTO nabeshima_id;
    INSERT INTO public.breweries (name, prefecture_code, description) VALUES ('西田酒造店', '02', '青森県。「田酒」は純米酒の代名詞的存在。') RETURNING id INTO denshu_id;
    INSERT INTO public.breweries (name, prefecture_code, description) VALUES ('油長酒造', '29', '奈良県。「風の森」はフレッシュでガス感のある味わいが特徴。') RETURNING id INTO kazenomori_id;
    INSERT INTO public.breweries (name, prefecture_code, description) VALUES ('黒龍酒造', '18', '福井県。高級酒の先駆け「黒龍」。') RETURNING id INTO kokuryu_id;
    INSERT INTO public.breweries (name, prefecture_code, description) VALUES ('小林酒造', '09', '栃木県。「鳳凰美田」は華やかなマスカット系の香りが人気。') RETURNING id INTO hououbiden_id;

    -- 2. Insert Brands
    INSERT INTO public.brands (brewery_id, name, kana) VALUES (aramasa_id, 'No.6', 'ナンバーシックス') RETURNING id INTO no6_id;
    INSERT INTO public.brands (brewery_id, name, kana) VALUES (jikon_id, '而今', 'じこん') RETURNING id INTO jikon_brand_id;
    INSERT INTO public.brands (brewery_id, name, kana) VALUES (dassai_id, '獺祭', 'だっさい') RETURNING id INTO dassai_brand_id;
    INSERT INTO public.brands (brewery_id, name, kana) VALUES (juyondai_id, '十四代', 'じゅうよんだい') RETURNING id INTO juyondai_brand_id;
    INSERT INTO public.brands (brewery_id, name, kana) VALUES (hakkaisan_id, '八海山', 'はっかいさん') RETURNING id INTO hakkaisan_brand_id;
    INSERT INTO public.brands (brewery_id, name, kana) VALUES (kubota_id, '久保田', 'くぼた') RETURNING id INTO kubota_brand_id;
    INSERT INTO public.brands (brewery_id, name, kana) VALUES (hiroki_id, '飛露喜', 'ひろき') RETURNING id INTO hiroki_brand_id;
    INSERT INTO public.brands (brewery_id, name, kana) VALUES (nabeshima_id, '鍋島', 'なべしま') RETURNING id INTO nabeshima_brand_id;
    INSERT INTO public.brands (brewery_id, name, kana) VALUES (denshu_id, '田酒', 'でんしゅ') RETURNING id INTO denshu_brand_id;
    INSERT INTO public.brands (brewery_id, name, kana) VALUES (kazenomori_id, '風の森', 'かぜのもり') RETURNING id INTO kazenomori_brand_id;
    INSERT INTO public.brands (brewery_id, name, kana) VALUES (kokuryu_id, '黒龍', 'こくりゅう') RETURNING id INTO kokuryu_brand_id;
    INSERT INTO public.brands (brewery_id, name, kana) VALUES (hououbiden_id, '鳳凰美田', 'ほうおうびでん') RETURNING id INTO hououbiden_brand_id;

    -- 3. Insert Variants
    -- No.6
    INSERT INTO public.variants (brand_id, name, abv, rice_polishing_ratio) VALUES 
      (no6_id, 'X-Type', 13, 45),
      (no6_id, 'S-Type', 13, 50),
      (no6_id, 'R-Type', 13, 65),
      (no6_id, 'A-Type', 13, 65);

    -- 而今
    INSERT INTO public.variants (brand_id, name, abv, rice_polishing_ratio) VALUES 
      (jikon_brand_id, '特別純米 火入れ', 16, 60),
      (jikon_brand_id, '純米吟醸 千本錦', 16, 55),
      (jikon_brand_id, '純米吟醸 雄町', 16, 55),
      (jikon_brand_id, '純米吟醸 山田錦', 16, 50);

    -- 獺祭
    INSERT INTO public.variants (brand_id, name, abv, rice_polishing_ratio) VALUES 
      (dassai_brand_id, '純米大吟醸 45', 16, 45),
      (dassai_brand_id, '純米大吟醸 磨き三割九分', 16, 39),
      (dassai_brand_id, '純米大吟醸 磨き二割三分', 16, 23);

    -- 十四代
    INSERT INTO public.variants (brand_id, name, abv, rice_polishing_ratio) VALUES 
      (juyondai_brand_id, '本丸', 15, 60),
      (juyondai_brand_id, '純米吟醸 龍の落とし子', 15, 50);

    -- 八海山
    INSERT INTO public.variants (brand_id, name, abv, rice_polishing_ratio) VALUES 
      (hakkaisan_brand_id, '特別本醸造', 15, 55),
      (hakkaisan_brand_id, '純米大吟醸', 15, 45);

    -- 久保田
    INSERT INTO public.variants (brand_id, name, abv, rice_polishing_ratio) VALUES 
      (kubota_brand_id, '萬寿', 15, 33),
      (kubota_brand_id, '千寿', 15, 50),
      (kubota_brand_id, '碧寿', 15, 50);

    -- 飛露喜
    INSERT INTO public.variants (brand_id, name, abv, rice_polishing_ratio) VALUES 
      (hiroki_brand_id, '特別純米', 16, 55),
      (hiroki_brand_id, '純米吟醸', 16, 50);

    -- 鍋島
    INSERT INTO public.variants (brand_id, name, abv, rice_polishing_ratio) VALUES 
      (nabeshima_brand_id, '特別純米', 15, 55),
      (nabeshima_brand_id, '純米吟醸 山田錦', 16, 50);

    -- 田酒
    INSERT INTO public.variants (brand_id, name, abv, rice_polishing_ratio) VALUES 
      (denshu_brand_id, '特別純米', 16, 55);

    -- 風の森
    INSERT INTO public.variants (brand_id, name, abv, rice_polishing_ratio) VALUES 
      (kazenomori_brand_id, '秋津穂 657', 16, 65),
      (kazenomori_brand_id, '山田錦 807', 16, 80);

    -- 黒龍
    INSERT INTO public.variants (brand_id, name, abv, rice_polishing_ratio) VALUES 
      (kokuryu_brand_id, '純米吟醸', 15, 55),
      (kokuryu_brand_id, '石田屋', 16, 35);
      
    -- 鳳凰美田
    INSERT INTO public.variants (brand_id, name, abv, rice_polishing_ratio) VALUES 
      (hououbiden_brand_id, '純米大吟醸', 16, 50),
      (hououbiden_brand_id, '剱', 16, 55);

END $$;
