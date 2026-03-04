<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Decode JSON input
$data = json_decode(file_get_contents("php://input"));

// Basic validation
if (
    empty($data->pickup_number) ||
    !isset($data->price_total) ||
    empty($data->products) ||
    !is_array($data->products)
) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'success' => false,
        'message' => 'Incomplete or invalid data provided. Required: pickup_number, price_total, products (array).'
    ]);
    exit;
}

try {
    require_once '../db_connect.php';

    // Start transaction
    $pdo->beginTransaction();

    // 1. Insert Order
    $orderQuery = "INSERT INTO orders (order_status_id, pickup_number, price_total) VALUES (:status, :pickup, :total)";
    $orderStmt = $pdo->prepare($orderQuery);

    // Default status 2: 'Placed and paid' or 1: 'Started' depending on flow, assuming 1 here
    $initialStatusId = 1;

    $orderStmt->execute([
        ':status' => $initialStatusId,
        ':pickup' => htmlspecialchars(strip_tags($data->pickup_number)),
        ':total' => (float) $data->price_total
    ]);

    $order_id = $pdo->lastInsertId();

    // 2. Insert Products into order_product mapping
    $productQuery = "INSERT INTO order_product (order_id, product_id, price) VALUES (:order_id, :product_id, :price)";
    $productStmt = $pdo->prepare($productQuery);

    foreach ($data->products as $product) {
        if (!isset($product->product_id) || !isset($product->price)) {
            throw new Exception("Product ID and price are required for all products in the order.");
        }

        $productStmt->execute([
            ':order_id' => $order_id,
            ':product_id' => (int) $product->product_id,
            ':price' => (float) $product->price
        ]);
    }

    // Commit transaction
    $pdo->commit();

    http_response_code(201); // Created
    echo json_encode([
        'success' => true,
        'message' => 'Order was created.',
        'data' => [
            'order_id' => $order_id
        ]
    ]);

} catch (Exception $e) {
    // Rollback transaction on failure
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500); // Internal Server Error
    echo json_encode([
        'success' => false,
        'message' => 'Failed to create order.',
        'error' => $e->getMessage()
    ]);
}
?>