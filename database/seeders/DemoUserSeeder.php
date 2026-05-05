<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DemoUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (range(1, 10) as $index) {
            $paddedIndex = str_pad((string) $index, 2, '0', STR_PAD_LEFT);

            User::updateOrCreate(
                ['email' => "demo{$paddedIndex}@alertazona.test"],
                [
                    'name' => "Usuario Demo {$paddedIndex}",
                    'password' => '1234abcd',
                    'email_verified_at' => now(),
                ],
            );
        }
    }
}
