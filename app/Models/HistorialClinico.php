<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistorialClinico extends Model
{
    protected $table = 'historial_clinico';
    protected $primaryKey = 'id_historial';

    protected $fillable = [
        'id_paciente',
        'fecha_modificacion',
        'contenido_cifrado'
    ];

    //Un historial clinico pertenece a un paciente
    public function paciente() {
        return $this->belongsTo(Paciente::class, 'id_paciente', 'id_paciente');
    }
}
