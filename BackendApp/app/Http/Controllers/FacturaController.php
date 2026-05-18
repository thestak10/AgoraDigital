<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\DetalleFactura;
use App\Models\Factura;
use App\Models\Paciente;
use App\Models\Profesional;
use Exception;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Mail\FacturaPaciente;
use Illuminate\Support\Facades\Mail;

class FacturaController extends Controller
{
    private function calcularPrecios($cantidadSesiones)
    {
        $precioPorSesion = 50.00;
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

    public function listarFacturas(Request $request)
    {

        try {

            $user = $request->user();
            $idUsuario = $user->id_usuario ?? $user->id; //recogemos el id del usuario logueado

            $profesional = Profesional::where('id_usuario', $idUsuario)->first(); //buscamos el profesional con ese id

            if (!$profesional) {
                return response()->json([
                    'success' => true,
                    'facturas' => []
                ]);
            }


            $idDelProfesional = $profesional->id_profesional;

            $facturas = Factura::whereHas('detalles.cita.paciente', function ($query) use ($idDelProfesional) { //nos traemos las facturas d3e los pacientes asignados al profesional logueado
                $query->where('id_profesional', $idDelProfesional);
            })
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'facturas' => $facturas
            ]);

        } catch (Exception $e) { // si algo falla en la base de datos, evitamos la pantalla en blanco y lo mandamos a los logs

            return response()->json([
                'success' => false,
                'facturas' => [], // Enviamos array vacío para que React no falle
                'error' => $e->getMessage()
            ]);
        }
    }

    public function descargarPDF($id_factura)
    {

        $factura = Factura::with('detalles')->findOrFail($id_factura); //traemos la factura con los detalles

        $pdf = Pdf::loadView('factura', ['factura' => $factura]); //inyectamos los datos de la factura en nuestra vista factura.blade.php

        return $pdf->download('Factura_PsicoMalaga_' . $factura->id_factura . '.pdf'); //lo enviamos como descarga
    }

    public function enviarEmail($id_factura)
    {
        $factura = Factura::with('detalles')->findOrFail($id_factura);

        $pdf = Pdf::loadView('factura', ['factura' => $factura]);
        $pdfContenido = $pdf->output(); //guardamos la factura en binario en la memoria del servidor

        $emailDestino = $factura->email_paciente_factura;

        Mail::to($emailDestino)->send(new FacturaPaciente($factura, $pdfContenido)); //enviamos el correo

        return response()->json([
            'success' => true,
            'mensaje' => 'Factura enviada por correo al paciente correctamente.'
        ]);
    }

}
