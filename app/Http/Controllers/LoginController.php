<?php

namespace App\Http\Controllers;

use App\Models\Administrador;
use App\Models\Paciente;
use App\Models\Profesional;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();     //busco el usuario por su email


        if (!$user || !Hash::check($request->password, $user->password)) {   //comprobamos que el usuario exista y que la contraseña sea correcta

            return response()->json(['message' => 'Credenciales incorrectas'], 401);

        }else{

            $token = $user->createToken('auth_token')->plainTextToken;

            $perfil = null;     //comprobamos que tipo de perfil tiene el usuario

            if ($user->rol_usuario == 1) {
                $perfil = Administrador::where('id_usuario', $user->id_usuario)->first();
            } elseif ($user->rol_usuario == 2) {
                $perfil = Profesional::where('id_usuario', $user->id_usuario)->first();
            } elseif ($user->rol_usuario == 3) {
                $perfil = Paciente::where('id_usuario', $user->id_usuario)->first();
            }

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',   //formato del token (protocolo OAuth2)
                'user' => [
                    'id' => $user->id_usuario,
                    'email' => $user->email,
                    'rol' => $user->rol_usuario,],
                'perfil'=>$perfil,
            ]);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ], 200);
    }
}
