<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Factura FAC-{{ str_pad($factura->id_factura, 4, '0', STR_PAD_LEFT) }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; line-height: 1.5; font-size: 14px; }
        .cabecera { border-bottom: 2px solid #172554; padding-bottom: 20px; margin-bottom: 20px; }
        .logo-texto { color: #172554; font-size: 24px; font-weight: bold; }
        .info-factura { margin-bottom: 30px; }
        .tabla-conceptos { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .tabla-conceptos th { background-color: #172554; color: white; padding: 10px; text-align: left; }
        .tabla-conceptos td { padding: 10px; border-bottom: 1px solid #ddd; }
        .total { text-align: right; font-size: 20px; font-weight: bold; color: #172554; margin-top: 20px; }
        .nota-iva { font-size: 12px; font-weight: normal; color: #777; margin-right: 15px; }
        .footer { position: fixed; bottom: -20px; left: 0px; right: 0px; height: 50px; text-align: center; font-size: 12px; color: #777; }
    </style>
</head>
<body>

<div class="cabecera">
    <table>
        <tr>
            <td>
                <h1 style="color: #172554; margin: 0; font-size: 28px;">Factura</h1>
            </td>
            <td width="50%" style="text-align: right;">
                <div class="logo-texto">CLÍNICA ÁGORA</div>
            </td>
        </tr>
    </table>
</div>

<div style="margin-bottom: 30px;">
    <strong>Fecha de factura:</strong> {{ $factura->created_at->format('d/m/Y') }}<br>
    <strong>Número de factura:</strong> FAC-{{ str_pad($factura->id_factura, 4, '0', STR_PAD_LEFT) }}<br>
    <strong>Método de pago:</strong> {{ $factura->metodo_pago }}
</div>

<div class="info-factura">
    <table style="border-top: 2px solid #e5e7eb; padding-top: 15px;">
        <tr>
            <td style="vertical-align: top; padding-right: 20px;">
                <h3 style="color: #172554; margin-top: 0; margin-bottom: 10px;">Datos del Paciente:</h3>
                <strong>{{ $factura->nombre_paciente_factura }} {{ $factura->apellidos_paciente_factura }}</strong><br>
                <strong>DNI:</strong> {{ $factura->dni_paciente_factura }}<br>
                <strong>Dirección:</strong> {{ $factura->direccion_paciente_factura ?? 'No especificada' }}<br>
                <strong>Email:</strong> {{ $factura->email_paciente_factura }}
            </td>

            <td style="vertical-align: top;">
                <h3 style="color: #172554; margin-top: 0; margin-bottom: 10px;">Datos de la Clínica:</h3>
                <strong>Clínica PsicoMálaga, S.L.</strong><br>
                <strong>CIF:</strong> B12345678<br>
                <strong>Dirección:</strong> Av. Principal 123, 1ºA<br>
                <strong>CP y ciudad:</strong> 29001, Málaga<br>
                <strong>Email:</strong> info@psicomalaga.com
            </td>
        </tr>
    </table>
</div>

<table class="tabla-conceptos">
    <thead>
    <tr>
        <th>Concepto</th>
        <th style="text-align: center;">Sesiones</th>
        <th style="text-align: right;">Precio/Sesión</th>
        <th style="text-align: right;">Total Línea</th>
    </tr>
    </thead>
    @php
        $detallesAgrupados = $factura->detalles->groupBy('modalidad_cita'); //agrupamos los detalles por modalidad
        $precioPorSesion = 50.00;
    @endphp

    @foreach($detallesAgrupados as $modalidad => $grupoDetalles)
        @php

            $cantidadTotal = $grupoDetalles->sum('cantidad_sesiones');
            $totalLinea = $cantidadTotal * $precioPorSesion;
        @endphp
        <tr>
            <td>Sesión Clínica - Modalidad: {{ $modalidad }}</td>
            <td style="text-align: center;">{{ $cantidadTotal }}</td>
            <td style="text-align: right;">{{ number_format($precioPorSesion, 2, ',', '.') }} €</td>
            <td style="text-align: right;">{{ number_format($totalLinea, 2, ',', '.') }} €</td>
        </tr>
    @endforeach
</table>

<div class="total">
    <span class="nota-iva">(IVA incluido)</span>
    TOTAL A PAGAR: {{ number_format($factura->precio_total, 2, ',', '.') }} €
</div>

<div class="footer">
    Gracias por confiar en nosotros.
</div>

</body>
</html>
