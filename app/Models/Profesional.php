<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profesional extends Model
{
    use HasFactory;

    protected $table = 'profesionales';
    protected $primaryKey = 'id_profesional';

    protected $fillable = [
        'id_usuario',
        'id_admin',
        'nombre_clinica',
        'nombre_profesional',
        'apellidos_profesional',
        'dni_profesional',
        'telefono_profesional',
        'direccion_profesional'
    ];

    //Un profesional es un usuario
    public function usuario() {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }

    //Un profesional es controlado por un administrador
    public function administrador() {
        return $this->belongsTo(Administrador::class, 'id_admin', 'id_admin');
    }

    //Un profesional gestiona muchos pacientes
    public function pacientes() {
        return $this->hasMany(Paciente::class, 'id_profesional', 'id_profesional');
    }
}
