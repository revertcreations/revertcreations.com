<?php

namespace App\Console\Commands;

use App\Models\Admin;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class ResetAdminPassword extends Command
{
    protected $signature = 'admin:reset-password {email} {password?}';

    protected $description = 'Reset the password for an admin user.';

    public function handle(): int
    {
        $email = $this->argument('email');
        $password = $this->argument('password');

        if (! $password) {
            $password = $this->secret('Enter the new password');
        }

        if (! $password) {
            $this->error('Password is required.');
            return self::FAILURE;
        }

        $admin = Admin::where('email', $email)->first();

        if (! $admin) {
            $this->error("Admin with email {$email} not found.");
            return self::FAILURE;
        }

        $admin->update([
            'password' => Hash::make($password),
        ]);

        $this->info('Password updated successfully.');

        return self::SUCCESS;
    }
}
