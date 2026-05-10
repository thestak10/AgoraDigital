<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistorialClinico extends Model
{
    protected $table = 'historial_clinico';
    protected $primaryKey = 'id_historial';

    protected $casts = [    //cifrado (AES-256) de datos para los historiales clinicos, laravel lo hace automaticamente, añadimos la fecha para que sea mas facil de manejar luego
        'contenido_cifrado' => 'encrypted',
        'fecha_modificacion' => 'datetime'
    ];
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
