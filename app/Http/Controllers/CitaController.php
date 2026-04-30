<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cita;
use App\Models\Paciente;

class CitaController extends Controller
{
    public function index (Request $request)
    {
        $usuario = $request->user();

        if ($usuario->rol_usuario == 2) {   //si el usuario es un profesional devolvemos solo las citas de ese profesional.

            $id_profesional = $usuario->profesional->id_profesional;    //Obtengo el id del profesional

            $ids_pacientes = Paciente::where('id_profesional', $id_profesional)->pluck('id_paciente'); //pluck es una funcion que extrae un conjunto de resultados y lo convierte en un array

            $citas = Cita::whereIn('id_paciente', $ids_pacientes)->get(); //Buscamos las citas de los ids obtenidos en ids_paciente

            return response()->json([
                'tipo_usuario'=> 'Profesional',
                'nombre' => $usuario->profesional->nombre_profesional,
                'total_citas' => $citas->count(),
                'datos' => $citas
            ]);

        } elseif ($usuario->rol_usuario == 1) {     //si el usuario es un admin se devuelven todas las citas

            return response()->json(Cita::all());

        }else{

            return response()->json(['message'=>'No tienes permiso para ver las citas',403]);
        }
    }


    public function store(Request $request) //Funcion para crear una cita
    {
        $usuario = $request->user();

        if ($usuario->rol_usuario != 1 && $usuario->rol_usuario != 2) {
            return response()->json(['message'=>'No tienes permiso para crear citas',403]);
        }

        $request->validate([
            'id_paciente' => 'required|exists:pacientes,id_paciente',
            'fecha_hora_cita' => 'required|date',
            'modalidad_cita' => 'required|in:Presencial,Online',  // Tenco que cambiarlo como el estado ciita solo se podrá elegirn entre presencial y online
            'estado_cita' => 'required|in:Pendiente,Completada,Cancelada' // En el front lo tengo que poner com o un despegable con las tres opciones
        ]);


        $cita = Cita::create([
            'id_paciente' => $request->id_paciente,
            'fecha_hora_cita' => $request->fecha_hora_cita,
            'modalidad_cita' => $request->modalidad_cita,
            'estado_cita' => $request->estado_cita,
        ]);

        return response()->json([
            'message' => 'Cita creada con éxito',
            'cita' => $cita
        ], 201);

    }

    public function update(Request $request, $id)
    {
        $usuario = $request->user();
        $cita = Cita::where('id_cita', $id)->first();

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        if ($usuario->rol_usuario == 2){

            $paciente = Paciente::where('id_paciente', $cita->id_paciente)->first();

        }

        $request->validate([    //uso sometimes por si solo quiero modificar un campo
            'fecha_hora_cita' => 'sometimes|required|date',
            'modalidad_cita' => 'sometimes|required|string',
            'estado_cita' => 'sometimes|required|string'
        ]);

        if ($request->has('fecha_hora_cita')) $cita->fecha_hora_cita = $request->fecha_hora_cita;
        if ($request->has('modalidad_cita')) $cita->modalidad_cita = $request->modalidad_cita;
        if ($request->has('estado_cita')) $cita->estado_cita = $request->estado_cita;

        $cita->save();

        return response()->json([
            'message' => 'Cita actualizada con éxito',
            'cita' => $cita
        ], 200);

    }

    public function destroy(Request $request,$id)
    {
        $usuario = $request->user();
        $cita = Cita::where('id_cita', $id)->first();

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        if ($usuario->rol_usuario == 2){
            $cita->delete();
        }

        return response()->json([
            'message' => 'Cita eliminada correctamente',
            'id_cita_borrada' => $cita->id_cita,
        ], 200);
    }
}
