<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentFailedLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payment_failed_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('campaign_id')->nullable();
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('submission_id')->nullable();
            $table->longText('message');
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
        Schema::dropIfExists('payment_failed_logs');
    }
}
