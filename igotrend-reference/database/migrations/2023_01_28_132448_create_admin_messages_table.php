<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admin_messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('from_user');
            $table->unsignedInteger('to_user');
            $table->text('message');
            $table->text('admin');
            $table->boolean('is_read')->default(0)->comment('0-un_read,1-read');
            $table->timestamps();

            $table->foreign('from_user')
                ->references('id')
                ->on('users');
            $table->foreign('to_user')
                ->references('id')
                ->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('admin_messages');
    }
}
