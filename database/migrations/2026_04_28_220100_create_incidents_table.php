<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type');
            $table->string('title')->nullable();
            $table->text('description');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('approximate_address')->nullable();
            $table->string('neighborhood')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->dateTime('occurred_at')->nullable();
            $table->string('status')->default('pending');
            $table->unsignedTinyInteger('confidence_score')->default(0);
            $table->unsignedInteger('visibility_radius')->default(250);
            $table->boolean('is_anonymous')->default(true);
            $table->boolean('is_public')->default(false);
            $table->foreignId('duplicate_of_id')->nullable()->constrained('incidents')->nullOnDelete();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'is_public']);
            $table->index(['type', 'status']);
            $table->index(['city', 'neighborhood']);
            $table->index('occurred_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};
