<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\DetalleFactura;
use App\Models\Factura;
use App\Models\Paciente;
use Illuminate\Http\Request;

class FacturaController extends Controller
{
    private function calcularPrecios($cantidadSesiones)
    {
        $precioPorSesion = 25.00;
        return [
            'precio_sesion' => $precioPorSesion,
            'total' => $cantidadSesiones * $precioPorSesion
        ];
    }
    public function guardarFactura(Request $request)
    {

        $request->validate([
            'id_paciente' => 'required|exists:pacientes,id_paciente',
            'metodo_pago' => 'required|string'
        ]);

        $paciente = Paciente::with('usuario')->findOrFail($request->id_paciente);
        $email = $paciente->usuario ? $paciente->usuario->email : 'sin_email@clinica.com';


        $citasYaFacturadas = DetalleFactura::pluck('id_cita')->toArray();
        $citasPendientes = Cita::where('id_paciente', $paciente->id_paciente)
            ->where('estado_cita', 'Completada')
            ->whereNotIn('id_cita', $citasYaFacturadas)
            ->get();

        if ($citasPendientes->isEmpty()) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Este paciente no tiene citas completadas pendientes de facturar.'
            ], 400);
        }

        $precios = $this->calcularPrecios($citasPendientes->count());

        $factura = Factura::create([
            'nombre_paciente_factura' => $paciente->nombre_paciente,
            'apellidos_paciente_factura' => $paciente->apellidos_paciente,
            'dni_paciente_factura' => $paciente->dni_paciente,
            'telefono_paciente_factura' => $paciente->telefono_paciente,
            'email_paciente_factura' => $email,
            'direccion_paciente_factura' => $paciente->direccion_paciente,
            'metodo_pago' => $request->metodo_pago,
            'precio_total' => $precios['total']
        ]);


        foreach ($citasPendientes as $cita) {
            DetalleFactura::create([
                'id_factura' => $factura->id_factura,
                'id_cita' => $cita->id_cita,
                'modalidad_cita' => $cita->modalidad_cita,
                'cantidad_sesiones' => 1
            ]);
        }

        return response()->json([
            'success' => true,
            'mensaje' => 'Factura creada. ' . $citasPendientes->count() . ' citas marcadas como facturadas.',
            'factura' => $factura->load('detalles')
        ]);
    }

    public function obtenerCitasPendientes($id_paciente)
    {

        $citasYaFacturadas = DetalleFactura::pluck('id_cita')->toArray(); // nos traemos de detalle factura el id_cita para saber que citas ya estan facturadas y lo guardamos en un array

        $citasPendientes = Cita::where('id_paciente', $id_paciente)     //buscamos en la citas del paciente las citas que esten completadas
            ->where('estado_cita', 'Completada')
            ->whereNotIn('id_cita', $citasYaFacturadas)     //la citas seran la que esten marcadas como completadas y que no esten facturadas
            ->get();

        $cantidadSesiones = $citasPendientes->count();
        $precios = $this->calcularPrecios($cantidadSesiones);

        return response()->json([
            'success' => true,
            'cantidad_sesiones' => $cantidadSesiones,
            'precio_total' => $precios['total'],
            'citas' => $citasPendientes
        ]);
    }

}
