<?php
require_once __DIR__ . '/../db_connect.php';

header('Content-Type: application/json');

try {
    $stmtCats = $pdo->query("SELECT * FROM categories");
    $categoriesDb = $stmtCats->fetchAll(PDO::FETCH_ASSOC);

    $stmtProds = $pdo->query("
        SELECT p.*, i.filename 
        FROM products p 
        LEFT JOIN images i ON p.image_id = i.image_id
        WHERE p.available = 1
    ");
    $productsDb = $stmtProds->fetchAll(PDO::FETCH_ASSOC);

    $catIdMap = [
        1 => ['id' => 'ontbijt', 'labelKey' => 'catBreakfast'],
        2 => ['id' => 'lunch', 'labelKey' => 'catLunch'],
        3 => ['id' => 'handheld', 'labelKey' => 'catHandheld'],
        4 => ['id' => 'sides', 'labelKey' => 'catSides'],
        5 => ['id' => 'dips', 'labelKey' => 'catDips'],
        6 => ['id' => 'drankjes', 'labelKey' => 'catDrinks'],
    ];

    $productNameKeyMap = [
        1  => 'prodAcaiBowl',
        2  => 'prodGardenWrap',
        3  => 'prodPBCacaoToast',
        4  => 'prodOvernightOats',
        5  => 'prodTofuTahiniBowl',
        6  => 'prodSupergreenHarvest',
        7  => 'prodFalafelBowl',
        8  => 'prodTeriyakiTempeh',
        9  => 'prodChickpeaWrap',
        10 => 'prodHalloumiToastie',
        11 => 'prodJackfruitSlider',
        12 => 'prodSweetPotatoWedges',
        13 => 'prodZucchiniFries',
        14 => 'prodFalafelBites',
        15 => 'prodVeggiePlatter',
        16 => 'prodClassicHummus',
        17 => 'prodAvocadoLime',
        18 => 'prodGreekRanch',
        19 => 'prodSrirachaMayo',
        20 => 'prodPeanutSatay',
        21 => 'prodGreenGlow',
        22 => 'prodIcedMatcha',
        23 => 'prodInfusedWater',
        24 => 'prodBerryBlast',
        25 => 'prodCitrusCooler',
    ];

    $productDescKeyMap = [
        1  => 'descAcaiBowl',
        2  => 'descGardenWrap',
        3  => 'descPBCacaoToast',
        4  => 'descOvernightOats',
        5  => 'descTofuTahiniBowl',
        6  => 'descSupergreenHarvest',
        7  => 'descFalafelBowl',
        8  => 'descTeriyakiTempeh',
        9  => 'descChickpeaWrap',
        10 => 'descHalloumiToastie',
        11 => 'descJackfruitSlider',
        12 => 'descSweetPotatoWedges',
        13 => 'descZucchiniFries',
        14 => 'descFalafelBites',
        15 => 'descVeggiePlatter',
        16 => 'descClassicHummus',
        17 => 'descAvocadoLime',
        18 => 'descGreekRanch',
        19 => 'descSrirachaMayo',
        20 => 'descPeanutSatay',
        21 => 'descGreenGlow',
        22 => 'descIcedMatcha',
        23 => 'descInfusedWater',
        24 => 'descBerryBlast',
        25 => 'descCitrusCooler',
    ];

    $mappedCategories = [];
    $productsByCategory = [];

    foreach ($categoriesDb as $cat) {
        $cid = (int) $cat['category_id'];
        if (isset($catIdMap[$cid])) {
            $mapped = $catIdMap[$cid];
            $mapped['name'] = $cat['name'];
            $mapped['image'] = '';
            $mappedCategories[] = $mapped;
            $productsByCategory[$mapped['id']] = [];
        } else {
            $mapped = [
                'id' => 'cat-' . $cid,
                'labelKey' => '',
                'name' => $cat['name'],
                'image' => ''
            ];
            $mappedCategories[] = $mapped;
            $productsByCategory[$mapped['id']] = [];
        }
    }

    foreach ($productsDb as $p) {
        $cid = (int) $p['category_id'];
        $stringId = isset($catIdMap[$cid]) ? $catIdMap[$cid]['id'] : 'cat-' . $cid;

        if (!isset($productsByCategory[$stringId]))
            continue;

        $productImage = $p['filename'] ? 'assets/images/menu/' . $p['filename'] : null;

        $productsByCategory[$stringId][] = [
            'id' => 'prod-' . $p['product_id'],
            'nameKey' => $productNameKeyMap[(int)$p['product_id']] ?? '',
            'descKey' => $productDescKeyMap[(int)$p['product_id']] ?? '',
            'name' => $p['name'],
            'description' => $p['description'] ?? '',
            'kcal' => $p['kcal'] !== null ? (int) $p['kcal'] : null,
            'price' => (float) $p['price'],
            'image' => $productImage
        ];
    }

    // Set each category's image to the first product image from that category
    foreach ($mappedCategories as &$cat) {
        $catProducts = $productsByCategory[$cat['id']] ?? [];
        foreach ($catProducts as $prod) {
            if (!empty($prod['image'])) {
                $cat['image'] = $prod['image'];
                break;
            }
        }
    }
    unset($cat);

    echo json_encode([
        'categories' => $mappedCategories,
        'productsByCategory' => $productsByCategory
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
