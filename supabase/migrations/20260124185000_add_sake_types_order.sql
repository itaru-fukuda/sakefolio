-- Add sort_order column
alter table sake_types add column if not exists sort_order integer default 1000;

-- Update sort_order for known types
update sake_types set sort_order = 10 where name = '純米大吟醸';
update sake_types set sort_order = 20 where name = '純米吟醸';
update sake_types set sort_order = 30 where name = '特別純米';
update sake_types set sort_order = 40 where name = '純米';
update sake_types set sort_order = 50 where name = '大吟醸';
update sake_types set sort_order = 60 where name = '吟醸';
update sake_types set sort_order = 70 where name = '特別本醸造';
update sake_types set sort_order = 80 where name = '本醸造';
update sake_types set sort_order = 90 where name = '普通酒';

update sake_types set sort_order = 100 where name = '生酒';
update sake_types set sort_order = 110 where name = '生原酒';
update sake_types set sort_order = 120 where name = '無濾過生原酒';
update sake_types set sort_order = 130 where name = 'おりがらみ';
update sake_types set sort_order = 140 where name = '中取り';
update sake_types set sort_order = 150 where name = 'あらばしり';
update sake_types set sort_order = 160 where name = '責め';
update sake_types set sort_order = 170 where name = '袋吊り';
update sake_types set sort_order = 180 where name = 'ひやおろし';
update sake_types set sort_order = 190 where name = '山廃';
update sake_types set sort_order = 200 where name = '生酛';
update sake_types set sort_order = 210 where name = '古酒';
update sake_types set sort_order = 220 where name = 'スパークリング';
update sake_types set sort_order = 230 where name = 'にごり酒';
