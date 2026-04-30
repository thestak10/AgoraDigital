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
        Schema::create('detalle_facturas', function (Blueprint $table) {
            $table->id('id_detalleFactura'); // PK
            $table->unsignedBigInteger('id_cita'); // FK
            $table->unsignedBigInteger('id_factura'); // FK
            $table->string('modalidad_cita');
            $table->integer('cantidad_sesiones');
            $table->timestamps();

            $table->foreign('id_cita')->references('id_cita')->on('citas')->onDelete('restrict');
            $table->foreign('id_factura')->references('id_factura')->on('facturas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_facturas');
    }
};
