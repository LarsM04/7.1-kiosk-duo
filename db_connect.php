<?php
$host = 'localhost';
$db = 'kiosk_db'; // De naam van je database uit phpMyAdmin
$user = 'root';      // Meestal 'root' bij XAMPP/MAMP
$pass = '';          // Meestal leeg bij XAMPP, of 'root' bij MAMP
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    // echo "Verbinding geslaagd!"; // Alleen om te testen
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int) $e->getCode());
}
?>