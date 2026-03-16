<?php
$dbPath = '../laravel-backend/database/database.sqlite';
try {
    $db = new PDO('sqlite:' . $dbPath);
    $stmt = $db->prepare("SELECT id, name, email, additional_email, flat FROM residents");
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($results as $row) {
        echo "ID: " . $row['id'] . " | Name: " . $row['name'] . " | Flat: [" . $row['flat'] . "] | Email: " . $row['email'] . "\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
