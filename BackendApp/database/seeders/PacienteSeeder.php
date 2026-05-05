<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Profesional;
use App\Models\Paciente;
use Illuminate\Support\Facades\Hash;

class PacienteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $profesionales = Profesional::all();
        $contadorPaciente = 1;


        foreach ($profesionales as $profesional) {      //creamos 3 pacientes por profesional en total 6 pacientes

            for ($i = 1; $i <= 3; $i++) {
                $userPac = User::factory()->create([
                    'email' => "paciente{$contadorPaciente}@psicomalaga.com",
                    'password' => Hash::make("paciente¨{$contadorPaciente}"),
                    'rol_usuario' => 3,
                ]);

                Paciente::factory()->create([
                    'id_usuario' => $userPac->id_usuario,
                    'id_profesional' => $profesional->id_profesional,
                ]);

                $contadorPaciente++;
            }
        }
    }
}
