<?php

namespace App\Http\Controllers;

use App\Models\HistorialClinico;
use Illuminate\Http\Request;

class HistorialClinicoController extends Controller
{

    public function obtenerHistorialPaciente($id_paciente)
    {
        $historial = HistorialClinico::where('id_paciente', $id_paciente)      //buscamos todas las notas de los historiales del paciente y las ordenamos desde la mas reciente a la mas antigua
            ->orderBy('fecha_modificacion', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'datos' => $historial
        ]);
    }


    public function guardarHistorial(Request $request)
    {

        $request->validate([    //validamos que desde el front nos envie el id del paciente y que el contenido no venga vacio
            'id_paciente' => 'required|exists:pacientes,id_paciente',
            'contenido_cifrado' => 'required|string',
        ]);

        $nota = HistorialClinico::create([  //creamos la nota que se cifra automaticamente
            'id_paciente' => $request->id_paciente,
            'contenido_cifrado' => $request->contenido_cifrado,
            'fecha_modificacion' => now(), //indicamos la fecha actual que es cuando se modifica el historial
        ]);

        return response()->json([
            'success' => true,
            'mensaje' => 'Nota guardada de forma segura.',
            'datos' => $nota
        ]);
    }
}
