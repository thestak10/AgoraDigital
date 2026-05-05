<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    protected $table = 'citas';
    protected $primaryKey = 'id_cita';

    protected $fillable = [
        'id_paciente',
        'fecha_hora_cita',
        'modalidad_cita',
        'estado_cita'
    ];

    //A una cita acude un paciente
    public function paciente() {
        return $this->belongsTo(Paciente::class, 'id_paciente', 'id_paciente');
    }

    //una cita genera un detalle factura
    public function detalleFactura() {
        return $this->hasOne(DetalleFactura::class, 'id_cita', 'id_cita');
    }
}
