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
        Schema::create('facturas', function (Blueprint $table) {
            $table->id('id_factura'); // PK
            $table->string('nombre_paciente_factura');
            $table->string('apellidos_paciente_factura');
            $table->string('dni_paciente_factura');
            $table->integer('telefono_paciente_factura');
            $table->string('email_paciente_factura');
            $table->string('direccion_paciente_factura');
            $table->string('metodo_pago');
            $table->decimal('precio_total', 10, 2); // Decimal para evitar errores de redondeo con euros
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facturas');
    }
};
