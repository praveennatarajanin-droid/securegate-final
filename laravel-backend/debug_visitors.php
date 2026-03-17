<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$visitors = App\Models\VisitorRequest::orderBy('created_at', 'desc')->take(10)->get();
echo "ID | Name | Status | Time | SocietyID\n";
echo "---|------|--------|------|----------\n";
foreach ($visitors as $v) {
    echo "{$v->id} | {$v->name} | {$v->status} | {$v->timestamp} | {$v->society_id}\n";
}
