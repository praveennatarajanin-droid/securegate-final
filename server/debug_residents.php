<?php
$dbPath = '../laravel-backend/database/database.sqlite';
try {
    $db = new PDO('sqlite:' . $dbPath);
    $stmt = $db->query("SELECT id, name, flat, email FROM residents");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "ID: " . $row['id'] . " | Name: [" . $row['name'] . "] | Flat: [" . $row['flat'] . "] | Email: [" . $row['email'] . "]\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
