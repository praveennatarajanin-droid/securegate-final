<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Society;
use App\Models\Community;
use App\Models\Block;
use App\Models\Apartment;
use App\Models\Resident;

$societies = Society::all();

foreach ($societies as $society) {
    $societyId = $society->id;
    echo "Repairing data for Society: " . $society->name . " (ID: $societyId)\n";

    // 1. Create Community if none exists for this society
    $community = Community::firstOrCreate(
        ['society_id' => $societyId],
        [
            'name' => $society->name . ' Enclave',
            'address' => '123 Tech Park',
            'city' => 'Chennai',
            'state' => 'TN',
            'zip' => '600001'
        ]
    );

    // 2. Create Blocks
    $blocks = ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F'];
    foreach ($blocks as $blockName) {
        $block = Block::firstOrCreate(
            ['name' => $blockName, 'society_id' => $societyId],
            ['community_id' => $community->id]
        );

        // 3. Create Apartments if block is empty
        if ($block->apartments()->count() == 0) {
            for ($i = 101; $i <= 105; $i++) {
                $unitNum = substr($blockName, -1) . '-' . $i;
                Apartment::create([
                    'number' => $unitNum,
                    'block_id' => $block->id,
                    'society_id' => $societyId
                ]);
            }
        }
    }
}

// 4. Update Residents
Resident::query()->whereNull('society_id')->update(['society_id' => $societyId]);

echo "Data repair completed successfully!\n";
