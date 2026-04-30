<?php

namespace Database\Factories;

use App\Models\Paciente;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Paciente>
 */
class PacienteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre_paciente' => fake()->firstName(),
            'apellidos_paciente' => fake()->lastName(),
            'dni_paciente' => fake()->unique()->regexify('[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]'),
            'telefono_paciente' => fake()->numerify('#########'),
            'direccion_paciente' => fake()->address(),
        ];
    }
}
