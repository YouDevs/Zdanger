<?php

use App\Models\User;
use Database\Seeders\DemoUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

test('demo user seeder creates ten predictable users with shared password', function () {
    $this->seed(DemoUserSeeder::class);

    expect(User::count())->toBe(10);

    $user = User::where('email', 'demo01@alertazona.test')->first();

    expect($user)->not->toBeNull();
    expect($user?->name)->toBe('Usuario Demo 01');
    expect(Hash::check('1234abcd', $user?->password ?? ''))->toBeTrue();
});
