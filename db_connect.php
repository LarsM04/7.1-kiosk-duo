<?php
// Eenvoudig database-connectiebestand voor Happy Herbivore kiosk.
// Pas de waarden hieronder aan als je andere inloggegevens gebruikt.

$dbHost = 'localhost';
$dbUser = 'root';       // Standaard in XAMPP
$dbPass = '';           // Standaard leeg in XAMPP
$dbName = 'happy_herbivore';

$mysqli = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

if ($mysqli->connect_errno) {
    http_response_code(500);
    die('Database-verbinding mislukt: ' . $mysqli->connect_error);
}

// Zorg dat alles in UTF-8 gaat (voor bv. "Açaí" en "€").
$mysqli->set_charset('utf8mb4');

// Voorbeeld: hoe je dit bestand in andere PHP-bestanden gebruikt:
// require __DIR__ . '/db_connect.php';
// $result = $mysqli->query('SELECT * FROM menu_items');
