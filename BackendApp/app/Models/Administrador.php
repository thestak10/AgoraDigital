<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Administrador extends Model
{
    use HasFactory;

    protected $table = 'administradores';   //Como el nombre de las tablas de la BD está en español, hay que indicarle cual es el nombre para que no rompa
    protected $primaryKey = 'id_admin';     //Como la clave primaria de Administrador no es id (la que viene por defecto en laravel), hay que indicar cual es la clave primaria personalizada

    protected $fillable = [
        'id_usuario',
        'nombre_admin',
        'apellidos_admin',
        'dni_admin',
        'telefono_admin'
    ];

    //Un administrador es un usuario
    public function usuario() {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }

    //Un administrador controla a muchos profesionales
    public function profesionales() {
        return $this->hasMany(Profesional::class, 'id_admin', 'id_admin');
    }
}
