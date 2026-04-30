<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;       //

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;


    protected $primaryKey = 'id_usuario';
    protected $fillable = [
        'email',
        'password',
        'rol_usuario',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed', // Laravel 12 hashea automaticamente
        ];
    }

    //Relacion usuario con tablas admin, profesional y paciente

    public function administrador() {
        return $this->hasOne(Administrador::class, 'id_usuario', 'id_usuario');
    }

    public function profesional() {
        return $this->hasOne(Profesional::class, 'id_usuario', 'id_usuario');
    }

    public function paciente() {
        return $this->hasOne(Paciente::class, 'id_usuario', 'id_usuario');
    }
}
