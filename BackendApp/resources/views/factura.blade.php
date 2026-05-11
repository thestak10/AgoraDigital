<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Factura</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; line-height: 1.5; }
        .cabecera { border-bottom: 2px solid #172554; padding-bottom: 20px; margin-bottom: 30px; }
        .logo-texto { color: #172554; font-size: 24px; font-weight: bold; }
        .info-factura { margin-bottom: 40px; }
        .tabla-conceptos { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .tabla-conceptos th { background-color: #172554; color: white; padding: 10px; text-align: left; }
        .tabla-conceptos td { padding: 10px; border-bottom: 1px solid #ddd; }
        .total { text-align: right; font-size: 20px; font-weight: bold; color: #172554; }
        .footer { position: fixed; bottom: -20px; left: 0px; right: 0px; height: 50px; text-align: center; font-size: 12px; color: #777; }
    </style>
</head>
<body>
    <div class="info-factura">
        <h3>Datos del Paciente:</h3>
        <p>
            <strong>Nombre:</strong> {{ $factura->nombre_paciente_factura }} {{ $factura->apellidos_paciente_factura }}<br>
            <strong>DNI:</strong> {{ $factura->dni_paciente_factura }}<br>
            <strong>Email:</strong> {{ $factura->email_paciente_factura }}<br>
        </p>
    </div>

    <table class="tabla-conceptos">
        <thead>
        <tr>
            <th>Concepto</th>
            <th>Sesiones</th>
        </tr>
        </thead>
        <tbody>
        @foreach($factura->detalles as $detalle)
            <tr>
                <td>Sesión Clínica - Modalidad: {{ $detalle->modalidad_cita }}</td>
                <td>{{ $detalle->cantidad_sesiones }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>

    <div class="total">
        TOTAL A PAGAR: {{ $factura->precio_total }} €
    </div>
</body>
</html>
