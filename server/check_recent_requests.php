<?php
$dbPath = 'securegate.db';
try {
    $db = new PDO('sqlite:' . $dbPath);
    $stmt = $db->query('SELECT id, name, flat, timestamp, visitor_photo FROM visitor_requests ORDER BY createdAt DESC LIMIT 10');
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($results as $row) {
        $hasPhoto = $row['visitor_photo'] ? 'YES' : 'NO';
        echo $row['id'] . " | Name: " . $row['name'] . " | Flat: " . $row['flat'] . " | Time: " . $row['timestamp'] . " | Photo: " . $hasPhoto . "\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
