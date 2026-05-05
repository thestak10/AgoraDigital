<?php

namespace Database\Factories;

use App\Models\Profesional;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Profesional>
 */
class ProfesionalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre_clinica' => 'PsicoMalaga',
            'nombre_profesional' => fake()->firstName(),
            'apellidos_profesional' => fake()->lastName(),
            'dni_profesional' => fake()->unique()->regexify('[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]'),
            'telefono_profesional' => fake()->numerify('#########'),
            'direccion_profesional' => fake()->address(),
        ];
    }
}
