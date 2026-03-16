<?php
$dbPath = 'securegate.db';
try {
    $db = new PDO('sqlite:' . $dbPath);
    $stmt = $db->query("PRAGMA table_info(visitor_requests)");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $row['name'] . " (" . $row['type'] . ")\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
