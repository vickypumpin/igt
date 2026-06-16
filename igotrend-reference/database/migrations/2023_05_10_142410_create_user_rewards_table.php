<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserRewardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_rewards', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('from_user')->nullable();
            $table->enum('type',['gems', 'air_time']);
            $table->string('amount');
            $table->boolean('status')->default(1)->comment('0=pending,1=successful');
            $table->boolean('is_guest')->default(0)->comment('0=authenticate user,1=guest user');
            $table->string('user_name');
            $table->unsignedInteger('campaign_id')->nullable();

            $table->foreign('user_id')
                ->references('id')
                ->on('users');

            $table->foreign('from_user')
                ->references('id')
                ->on('users');

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
        Schema::dropIfExists('user_rewards');
    }
}
