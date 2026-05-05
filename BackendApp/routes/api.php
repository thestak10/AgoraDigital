<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\CitaController;

//Rutas sin token
Route::post('/login', [LoginController::class, 'login']);


//Rutas protegidas con el token

Route::middleware(['auth:sanctum'])->group(function () {

    //Pacientes
    Route::get('/pacientes',[PacienteController::class,'index']); //Ruta para ver todos los pacientes

    Route::post('/pacientes', [PacienteController::class, 'store']);

    Route::put('/pacientes/{id}', [PacienteController::class, 'update']);

    Route::delete('/pacientes/{id}', [PacienteController::class, 'destroy']);

    //Citas
    Route::get('/citas',[CitaController::class,'index']);   //Ruta para ver las citas agendadas de un profesional

    Route::post('/citas',[CitaController::class,'store']);  //Ruta para crear citas

    Route::put('/citas/{id}', [CitaController::class, 'update']);

    Route::delete('/citas/{id}', [CitaController::class, 'destroy']);

    Route::post('/logout', [LoginController::class, 'logout']);


});
