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
            'nameKey' => '',
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
