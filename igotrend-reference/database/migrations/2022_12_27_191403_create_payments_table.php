<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('campaign_id')->nullable();
            $table->unsignedInteger('user_id');
            $table->string('tx_ref');
            $table->string('flw_ref')->nullable();
            $table->string('amount');
            $table->string('tax_amount')->default(0);
            $table->string('payment_type');
            $table->boolean('payment_status')->comment('0=processing,1=complete')->nullable();
            $table->string('account_number')->nullable();
            $table->string('bank_code')->nullable();
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('campaign_id')
                ->references('id')
                ->on('campaigns')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payments');
    }
}
