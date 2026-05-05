<?php

namespace Database\Factories;

use App\Models\Administrador;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Administrador>
 */
class AdministradorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre_admin' => fake()->firstName(),
            'apellidos_admin' => fake()->lastName(),
            'dni_admin' => fake()->unique()->regexify('[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]'),
            'telefono_admin' => fake()->numerify('#########'),
        ];
    }
}
