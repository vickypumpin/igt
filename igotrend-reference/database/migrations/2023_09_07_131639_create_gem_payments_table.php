<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGemPaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gem_payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('trender_id');
            $table->string('tx_ref');
            $table->string('flw_ref');
            $table->string('amount');
            $table->string('tax_amount');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('gem_payments');
    }
}
