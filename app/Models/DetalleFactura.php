<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetalleFactura extends Model
{
    protected $table = 'detalle_facturas';
    protected $primaryKey = 'id_detalleFactura';

    protected $fillable = [
        'id_cita',
        'id_factura',
        'modalidad_cita',
        'cantidad_sesiones'
    ];

    //Un detalle factura pertenece a una factura
    public function factura() {
        return $this->belongsTo(Factura::class, 'id_factura', 'id_factura');
    }

    //Un detalle factura pertenece a una cita
    public function cita() {
        return $this->belongsTo(Cita::class, 'id_cita', 'id_cita');
    }
}
