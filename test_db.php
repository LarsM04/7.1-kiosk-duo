<?php
require 'db_connect.php';
$c = $pdo->query('SELECT * FROM categories')->fetchAll(PDO::FETCH_ASSOC);
$p = $pdo->query('SELECT p.*, i.filename FROM products p LEFT JOIN images i ON p.image_id = i.image_id')->fetchAll(PDO::FETCH_ASSOC);
file_put_contents('out2.json', json_encode(['categories' => $c, 'products' => $p]));
