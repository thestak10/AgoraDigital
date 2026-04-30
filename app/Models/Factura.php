<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Factura extends Model
{
    protected $table = 'facturas';
    protected $primaryKey = 'id_factura';

    protected $fillable = [
        'id_cita',
        'nombre_paciente_factura',
        'apellidos_paciente_factura',
        'dni_paciente_factura',
        'telefono_paciente_factura',
        'email_paciente_factura',
        'direccion_paciente_factura',
        'metodo_pago',
        'precio_total'
    ];

    //Una factura contiene muchos detalles factura
    public function detalles() {
        return $this->hasMany(DetalleFactura::class, 'id_factura', 'id_factura');
    }
}
