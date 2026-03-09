<?php
$host = 'localhost';
$db = 'u240753_kiosk'; // De naam van je database uit phpMyAdmin
$user = 'u240753_kiosk';      // Meestal 'root' bij XAMPP/MAMP
$pass = 'EyctUFNdWzHTSUTy5M2Y';          // Meestal leeg bij XAMPP, of 'root' bij MAMP
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