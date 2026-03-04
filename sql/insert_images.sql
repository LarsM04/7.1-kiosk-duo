SET FOREIGN_KEY_CHECKS = 0;

-- 1. Maak de images tabel leeg voor een schone start
TRUNCATE TABLE `images`;

-- 2. Reset de image_id's in de products tabel (optioneel, voor de zekerheid)
UPDATE `products` SET `image_id` = NULL;

-- 1. Morning Boost Açaí Bowl (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('morning_boost_acai_bowl.png', 'Morning Boost Açaí Bowl');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Morning Boost Açaí Bowl%';

-- 2. The Garden Breakfast Wrap (V)
INSERT INTO `images` (`filename`, `description`) VALUES ('the_garden_breakfast_wrap.png', 'The Garden Breakfast Wrap');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'The Garden Breakfast Wrap%';

-- 3. Peanut Butter & Cacao Toast (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('peanut_butter_&_cacao_toast.png', 'Peanut Butter & Cacao Toast');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Peanut Butter & Cacao%';

-- 4. Overnight Oats: Apple Pie Style (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('overnight_oats_apple_pie_style.png', 'Overnight Oats');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Overnight Oats%';

-- 5. Tofu Power Tahini Bowl (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('tofu_power_tahini_bowl.png', 'Tofu Power Tahini Bowl');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Tofu Power Tahini%';

-- 6. The Supergreen Harvest (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('the_supergreen_harvest.png', 'The Supergreen Harvest');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'The Supergreen Harvest%';

-- 7. Mediterranean Falafel Bowl (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('mediterraean_falafel_bowl.png', 'Mediterranean Falafel Bowl');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Mediterranean Falafel%';

-- 8. Warm Teriyaki Tempeh Bowl (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('warm_teriyaki_tempeh_bowl.png', 'Warm Teriyaki Tempeh Bowl');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Warm Teriyaki Tempeh%';

-- 9. Zesty Chickpea Hummus Wrap (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('zesty_chickpea_hummus_wrap.png', 'Zesty Chickpea Hummus Wrap');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Zesty Chickpea%';

-- 10. Avocado & Halloumi Toastie (V)
INSERT INTO `images` (`filename`, `description`) VALUES ('avocado_&_halloumi_toastie.png', 'Avocado & Halloumi Toastie');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Avocado & Halloumi%';

-- 11. Smoky BBQ Jackfruit Slider (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('smoky_bbq_jackfruit_slider.png', 'Smoky BBQ Jackfruit Slider');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Smoky BBQ%';

-- 12. Oven-Baked Sweet Potato Wedges (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('oven_baked_sweet_potato_wedges.png', 'Sweet Potato Wedges');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Oven-Baked Sweet Potato%';

-- 13. Zucchini Fries (V)
INSERT INTO `images` (`filename`, `description`) VALUES ('zucchini_fries.png', 'Zucchini Fries');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Zucchini Fries%';

-- 14. Baked Falafel Bites - 5pcs (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('baked_falafel_bites.png', 'Baked Falafel Bites');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Baked Falafel Bites%';

-- 15. Mini Veggie Platter & Hummus (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('mini_veggie_platter_&_hummus.png', 'Mini Veggie Platter');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Mini Veggie Platter%';

-- 16. Classic Hummus (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('classic_hummus.png', 'Classic Hummus');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Classic Hummus%';

-- 17. Avocado Lime Crema (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('avocado_lime_crema.png', 'Avocado Lime Crema');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Avocado Lime%';

-- 18. Greek Yogurt Ranch (V)
INSERT INTO `images` (`filename`, `description`) VALUES ('grek_yoghurt_ranch.png', 'Greek Yogurt Ranch');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Greek Yogurt Ranch%';

-- 19. Spicy Sriracha Mayo (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('spicy_sriracha_mayo.png', 'Spicy Sriracha Mayo');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Spicy Sriracha%';

-- 20. Peanut Satay Sauce (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('peanut_satay_sauce.png', 'Peanut Satay Sauce');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Peanut Satay%';

-- 21. Green Glow Smoothie (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('green_glow_smoothie.png', 'Green Glow Smoothie');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Green Glow%';

-- 22. Iced Matcha Latte (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('iced_matcha.png', 'Iced Matcha');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Iced Matcha%';

-- 23. Fruit-Infused Water (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('fruit_infused_water.png', 'Fruit-Infused Water');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Fruit-Infused Water%';

-- 24. Berry Blast Smoothie (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('berry_blast_smoothie.png', 'Berry Blast Smoothie');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Berry Blast%';

-- 25. Citrus Cooler (VG)
INSERT INTO `images` (`filename`, `description`) VALUES ('citrus_cooler.png', 'Citrus Cooler');
UPDATE `products` SET `image_id` = LAST_INSERT_ID() WHERE `name` LIKE 'Citrus Cooler%';

SET FOREIGN_KEY_CHECKS = 1;