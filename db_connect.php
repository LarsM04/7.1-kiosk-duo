<?php
$host = 'localhost';
$db = 'kiosk_db'; // Lokale XAMPP database
$user = 'root';      // XAMPP gebruiker
$pass = '';          // XAMPP wachtwoord is leeg
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