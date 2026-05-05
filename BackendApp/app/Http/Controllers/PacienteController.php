<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Paciente;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class PacienteController extends Controller
{
    public function index(Request $request)
    {
        $usuario = $request->user();

        if ($usuario->rol_usuario == 2) {   //si el usuario es un profesional devolvemos solo los pacientes de ese profesional.

            $pacientes = Paciente::where('id_profesional', $usuario->profesional->id_profesional)->get();

            return response()->json([
                'profesional' => $usuario->profesional->nombre_profesional,
                'total_pacientes' => $pacientes->count(),
                'datos' => $pacientes
            ]);

        } elseif ($usuario->rol_usuario == 1) {     //si el usuario es un admin se devuelven todos los pacientes

            return response()->json(Paciente::all());

        }else{

            return response()->json(['message'=>'No tienes permiso',403]);
        }

    }

    public function store(Request $request)
    {
        $usuario = $request->user();

        if ($usuario->rol_usuario != 1 && $usuario->rol_usuario != 2) {
            return response()->json(['message' => 'No tienes permiso para registrar pacientes'], 403);
        }

        $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'nombre' => 'required|string',
            'apellidos' => 'required|string',
            'dni' => 'required|string|unique:pacientes,dni_paciente',
            'telefono' => 'required|numeric',
            'direccion' => 'required|string'
        ]);

        $id_prof = null;

        if ($usuario->rol_usuario == 2) {
            $id_prof = $usuario->profesional->id_profesional; //si es profesional
        } else {
            $id_prof = $request->id_profesional;    //es admin
        }

        $nuevoUsuario = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'rol_usuario' => 3
        ]);


        $paciente = Paciente::create([

            'id_usuario' => $nuevoUsuario->id_usuario,
            'id_profesional' => $id_prof,
            'nombre_paciente' => $request->nombre,
            'apellidos_paciente' => $request->apellidos,
            'dni_paciente' => $request->dni,
            'telefono_paciente' => $request->telefono,
            'direccion_paciente' => $request->direccion,
        ]);

        return response()->json([
            'message' => 'Paciente registrado con éxito',
            'paciente' => $paciente
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $userAutenticado = $request->user();

        $paciente =Paciente::where('id_paciente', $id)->first();

        //Compruebo que el paciente exista y que solo su profesional asignado pueda modificar sus datos.

        if (!$paciente) {
            return response()->json(['message' => 'Paciente no encontrado'], 404);
        }

        if ($userAutenticado->rol_usuario == 2) {

            if ($paciente->id_profesional != $userAutenticado->profesional->id_profesional) {
                return response()->json(['message' => 'No tienes permiso sobre este paciente'], 403);
            }
        }

        $request->validate([
            'nombre' => 'sometimes|required|string',
            'apellidos' => 'sometimes|required|string',
            'telefono' => 'sometimes|required|numeric',
            'direccion' => 'sometimes|required|string',
            'email' => 'sometimes|required|email|unique:users,email,' . $paciente->id_usuario . ',id_usuario',
            'password' => 'sometimes|required|min:6'
        ]);

        //Actualizamos la tabla pacientes

        if ($request->has('nombre')) $paciente->nombre_paciente = $request->nombre;
        if ($request->has('apellidos')) $paciente->apellidos_paciente = $request->apellidos;
        if ($request->has('telefono')) $paciente->telefono_paciente = $request->telefono;
        if ($request->has('direccion')) $paciente->direccion_paciente = $request->direccion;
        $paciente->save();


        $cuentaUsuario = User::find($paciente->id_usuario);


        //Actualizamos la tabla users donde tenemos los campos de email y contraseña

        if ($request->has('email')) {
            $cuentaUsuario->email = $request->email;
        }

        if ($request->has('password')) {
            $cuentaUsuario->password = Hash::make($request->password);
        }

        $cuentaUsuario->save();

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'paciente' => $paciente,
            'user' => [
                'email' => $cuentaUsuario->email
            ]
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $usuario = $request->user();

        $paciente = Paciente::where('id_paciente', $id)->first();
        $id_usuario_del_paciente = $paciente->id_usuario;

        if (!$paciente) {
            return response()->json(['message' => 'Paciente no encontrado'], 404);
        }

        if ($usuario->rol_usuario == 2) {
            if ($paciente->id_profesional != $usuario->profesional->id_profesional) {
                return response()->json(['message' => 'No tienes permiso para eliminar este paciente'], 403);
            }
        }

        $paciente->delete(); //borramos los datos del paciente

        User::where('id_usuario', $id_usuario_del_paciente)->delete(); //Borramos el usuario de la tabla user

        // Nota: Laravel borrará automáticamente sus citas si configuraste las claves foráneas con "onDelete('cascade')", si no, habría que borrarlas a mano aquí.

        return response()->json([
            'message' => 'Paciente y cuenta de usuario eliminado correctamente'
        ], 200);
    }
}
