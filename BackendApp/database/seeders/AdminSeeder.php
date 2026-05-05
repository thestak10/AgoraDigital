<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Administrador;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $userAdmin = User::factory()->create([
            'email' => 'admin1@psicomalaga.com',
            'password' => Hash::make("admin1"), //cifrado de la contraseña
            'rol_usuario' => 1,
        ]);

        Administrador::factory()->create([          //relaciono el id del usuario creado en userAdmin, con el id del perfil de administrador de esta forma le asigno la id_usuario FK al administrador
            'id_usuario' => $userAdmin->id_usuario,
        ]);
    }
}
