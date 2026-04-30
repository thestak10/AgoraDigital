<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Administrador;
use App\Models\Profesional;

class ProfesionalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $admin = Administrador::first();        //utilizo first por que solo tenemos un administrador


        for ($i = 1; $i <= 2; $i++) {               //creamos 2 profesionales
            $userProf = User::factory()->create([
                'email' => "psicologo{$i}@psicomalaga.com",
                'password' => Hash::make("profesional{$i}"),
                'rol_usuario' => 2,
            ]);

            Profesional::factory()->create([        //asignamos las id de las FK de los profesionales
                'id_usuario' => $userProf->id_usuario,
                'id_admin' => $admin->id_admin,
            ]);
        }
    }
}
