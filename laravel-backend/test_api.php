<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\Request;
use App\Models\Block;

$request = Request::create('/api/blocks', 'GET', ['society_id' => 1]);
$response = Route::dispatch($request);

echo $response->getContent();
