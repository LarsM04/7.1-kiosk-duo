<?php
/**
 * Lokale Database Test voor XAMPP
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>🧪 Lokale Database Test</h1>";

try {
    require_once 'db_connect.php';
    echo "<p style='color: green;'>✓ Database verbinding geslaagd!</p>";
    
    // Test categorieën
    $stmt = $pdo->query("SELECT * FROM categories");
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "<p><strong>Categoriën:</strong> " . count($categories) . "</p>";
    
    // Test producten
    $stmt = $pdo->query("SELECT * FROM products");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "<p><strong>Producten:</strong> " . count($products) . "</p>";
    
    if (count($products) > 0) {
        echo "<h3>Producten gevonden:</h3>";
        echo "<ul>";
        foreach ($products as $p) {
            echo "<li>" . htmlspecialchars($p['name']) . " - €" . number_format($p['price'], 2) . "</li>";
        }
        echo "</ul>";
    } else {
        echo "<p style='color: orange;'>⚠ Geen producten in de database!</p>";
    }
    
} catch (\PDOException $e) {
    echo "<p style='color: red;'>✗ Fout: " . $e->getMessage() . "</p>";
}
?>
