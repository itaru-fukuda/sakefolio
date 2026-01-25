-- Seed Initial Sake Types
insert into sake_types (name) values
    -- Specific Designations
    ('純米大吟醸'),
    ('純米吟醸'),
    ('特別純米'),
    ('純米'),
    ('大吟醸'),
    ('吟醸'),
    ('特別本醸造'),
    ('本醸造'),
    ('普通酒'),
    -- Methods / Characteristics
    ('生酒'),
    ('生原酒'),
    ('無濾過生原酒'),
    ('おりがらみ'),
    ('中取り'),
    ('あらばしり'),
    ('責め'),
    ('袋吊り'),
    ('ひやおろし'),
    ('山廃'),
    ('生酛'),
    ('古酒'),
    ('スパークリング'),
    ('にごり酒')
on conflict (name) do nothing;
