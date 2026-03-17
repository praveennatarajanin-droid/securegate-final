<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Block;
use App\Models\Apartment;

echo "--- Blocks ---\n";
print_r(Block::all()->toArray());
echo "\n--- Apartments Count ---\n";
echo Apartment::count();
echo "\n";
