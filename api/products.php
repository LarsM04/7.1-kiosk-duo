<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

try {
    require_once '../db_connect.php';
    $query = "
        SELECT 
            p.product_id,
            p.category_id,
            c.name as category_name,
            p.image_id,
            p.name,
            p.description,
            p.price,
            p.kcal,
            p.available
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute();

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Ensure numeric values are properly cast (PDO mapping sometimes returns strings)
    foreach ($products as &$product) {
        $product['product_id'] = (int) $product['product_id'];
        $product['category_id'] = $product['category_id'] !== null ? (int) $product['category_id'] : null;
        $product['image_id'] = $product['image_id'] !== null ? (int) $product['image_id'] : null;
        $product['price'] = (float) $product['price'];
        $product['kcal'] = $product['kcal'] !== null ? (int) $product['kcal'] : null;
        $product['available'] = (bool) $product['available'];
    }

    echo json_encode([
        'success' => true,
        'data' => $products
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}
?>