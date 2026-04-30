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
        Schema::create('profesionales', function (Blueprint $table) {
            $table->id('id_profesional'); // PK
            $table->unsignedBigInteger('id_usuario'); // FK
            $table->unsignedBigInteger('id_admin'); // FK
            $table->string('nombre_clinica')->nullable(); // Tu propuesta de mejora
            $table->string('nombre_profesional');
            $table->string('apellidos_profesional');
            $table->string('dni_profesional')->unique();
            $table->integer('telefono_profesional');
            $table->string('direccion_profesional');
            $table->timestamps();

            $table->foreign('id_usuario')->references('id_usuario')->on('users')->onDelete('cascade');
            $table->foreign('id_admin')->references('id_admin')->on('administradores')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profesionales');
    }
};
