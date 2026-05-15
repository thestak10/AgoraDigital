<?php

namespace App\Mail;

use App\Models\Factura;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FacturaPaciente extends Mailable
{
    use Queueable, SerializesModels;

    public $factura;
    public $pdfContenido;
    public function __construct(Factura $factura, $pdfContenido)
    {
        $this->factura = $factura;
        $this->pdfContenido = $pdfContenido;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope    //asunto del correo
    {
        return new Envelope(
            subject: 'Tu factura de clinica PsicoMalaga - ' . $this->factura->nombre_paciente_factura,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content  //cuerpo del correo
    {
        return new Content(
            view: 'emails.texto_factura',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array    //nombramos el archivo de la factura  y le indicamos al gestor de correos que es un pdf
    {
        return [Attachment::fromData(fn () => $this->pdfContenido, 'Factura_PsicoMalaga_' . $this->factura->id_factura . '.pdf')
            ->withMime('application/pdf'),];
    }
}
