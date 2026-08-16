<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained()->restrictOnDelete();
            $table->string('batch_number');
            $table->unsignedInteger('quantity');
            $table->date('expiry_date')->nullable();
            $table->date('received_date');
            $table->enum('status', ['active', 'expired', 'depleted'])->default('active');
            $table->timestamps();

            // The FEFO lookup path — "oldest-expiring active batch of item X
            // at branch Y" must be an index scan, never a full scan followed
            // by an in-memory sort.
            $table->index(['item_id', 'branch_id', 'expiry_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('batches');
    }
};
