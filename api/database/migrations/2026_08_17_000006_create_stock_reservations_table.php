<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained()->restrictOnDelete();
            $table->foreignId('branch_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('quantity');
            $table->string('reference_type');
            $table->unsignedBigInteger('reference_id');
            $table->enum('status', ['active', 'released', 'fulfilled'])->default('active');
            $table->timestamps();

            // Availability computation (Section 3) sums active reservations
            // for an item+branch pair — this is that lookup's index.
            $table->index(['item_id', 'branch_id', 'status']);
            $table->index(['reference_type', 'reference_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_reservations');
    }
};
