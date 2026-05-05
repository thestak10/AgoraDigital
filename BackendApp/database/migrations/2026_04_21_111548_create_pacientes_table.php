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
        Schema::create('pacientes', function (Blueprint $table) {
            $table->id('id_paciente'); // PK
            $table->unsignedBigInteger('id_usuario'); // FK
            $table->unsignedBigInteger('id_profesional'); // FK
            $table->string('nombre_paciente');
            $table->string('apellidos_paciente');
            $table->string('dni_paciente')->unique();
            $table->integer('telefono_paciente');
            $table->string('direccion_paciente');
            $table->timestamps();

            $table->foreign('id_usuario')->references('id_usuario')->on('users')->onDelete('cascade');
            $table->foreign('id_profesional')->references('id_profesional')->on('profesionales')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pacientes');
    }
};
