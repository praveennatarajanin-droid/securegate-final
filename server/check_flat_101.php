<?php
$dbPath = '../laravel-backend/database/database.sqlite';
try {
    $db = new PDO('sqlite:' . $dbPath);
    $stmt = $db->prepare("SELECT id, name, email, additional_email, flat FROM residents WHERE flat = '101'");
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($results as $row) {
        echo "ID: " . $row['id'] . "\n";
        echo "Name: " . $row['name'] . "\n";
        echo "Email: " . $row['email'] . "\n";
        echo "Additional Email: " . $row['additional_email'] . "\n";
        echo "Flat: " . $row['flat'] . "\n";
        echo "-------------------\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
