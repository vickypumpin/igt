<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserPaymentInfoRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_payment_info_requests', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->integer('bank_id');
            $table->string('account_number');
            $table->boolean('is_approved')->default(0)->comment('0= un-approved,1=approved');
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
        Schema::dropIfExists('user_payment_info_requests');
    }
}
