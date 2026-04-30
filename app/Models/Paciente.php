<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    use HasFactory;

    protected $table = 'pacientes';
    protected $primaryKey = 'id_paciente';

    protected $fillable = [
        'id_usuario',
        'id_profesional',
        'nombre_paciente',
        'apellidos_paciente',
        'dni_paciente',
        'telefono_paciente',
        'direccion_paciente'
    ];

    //Un paciente es un usuario
    public function usuario() {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }

    //Un paciente es gestionado por un profesional
    public function profesional() {
        return $this->belongsTo(Profesional::class, 'id_profesional', 'id_profesional');
    }

    //Un paciente tiene muchos historiales clinicos
    public function historial() {
        return $this->hasMany(HistorialClinico::class, 'id_paciente', 'id_paciente');
    }

    //Un paciente acude a muchas citas
    public function citas() {
        return $this->hasMany(Cita::class, 'id_paciente', 'id_paciente');
    }
}
