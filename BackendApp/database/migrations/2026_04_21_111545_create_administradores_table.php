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
        Schema::create('administradores', function (Blueprint $table) {
            $table->id('id_admin'); // PK
            $table->unsignedBigInteger('id_usuario'); // FK
            $table->string('nombre_admin');
            $table->string('apellidos_admin');
            $table->string('dni_admin')->unique();
            $table->integer('telefono_admin');
            $table->timestamps();

            $table->foreign('id_usuario')->references('id_usuario')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('administradores');
    }
};
