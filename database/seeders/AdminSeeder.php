<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\Admin;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::updateOrCreate([
            'email' => 'trever@revertcreations.com',
        ], [
            'username' => 'revert',
            'password' => Hash::make('foursppe'),
            'remember_token' => Str::random(40),
        ]);
    }
}
