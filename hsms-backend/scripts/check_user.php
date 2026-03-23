<?php

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../bootstrap/app.php';

$kernel = app()->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'admin@school.com')->first();

if ($user) {
    echo "found: {$user->email} (role={$user->role})\n";
} else {
    echo "not found\n";
}
