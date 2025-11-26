import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { presupuestoId, email, enlacePublico } = body;

    // Buscar presupuesto
    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id: presupuestoId },
      include: {
        cliente: true,
        productos: true,
      },
    });

    if (!presupuesto) {
      return NextResponse.json(
        { error: "Presupuesto no encontrado" },
        { status: 404 }
      );
    }

    // Configurar transporter de nodemailer
    // Nota: Esto requiere configurar las variables de entorno SMTP_*
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verificar que el transporter esté configurado
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn("SMTP no configurado. El correo no se enviará.");
      
      // Actualizar estado del presupuesto igualmente
      await prisma.presupuesto.update({
        where: { id: presupuestoId },
        data: { estado: "enviado" },
      });

      return NextResponse.json({
        message: "Presupuesto marcado como enviado (SMTP no configurado)",
        warning: "Configura SMTP para enviar correos reales",
      });
    }

    const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "Tu Tienda de Informática";

    // Crear HTML del correo (con estilos inline para compatibilidad)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0 0 10px 0; font-size: 28px;">${companyName}</h1>
                    <p style="margin: 0; font-size: 18px; opacity: 0.9;">Presupuesto #${presupuesto.numero}</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px; background-color: #ffffff;">
                    <p style="margin: 0 0 20px 0; font-size: 16px;">Estimado/a <strong>${presupuesto.cliente.nombre}</strong>,</p>
                    
                    <p style="margin: 0 0 20px 0; font-size: 15px;">Le enviamos el presupuesto solicitado con los siguientes productos:</p>
                    
                    <table width="100%" cellpadding="8" cellspacing="0" style="margin: 20px 0; border: 1px solid #e5e7eb; border-radius: 8px;">
                      ${presupuesto.productos
                        .map(
                          (p) =>
                            `<tr style="border-bottom: 1px solid #f3f4f6;">
                              <td style="padding: 12px; font-size: 14px;">
                                <strong>${p.nombre}</strong><br>
                                <span style="color: #6b7280;">${p.cantidad} x €${p.precio.toFixed(2)} = €${(p.precio * p.cantidad).toFixed(2)}</span>
                              </td>
                            </tr>`
                        )
                        .join("")}
                    </table>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td style="text-align: center; padding: 20px; background-color: #f0f9ff; border-radius: 8px;">
                          <p style="margin: 0; font-size: 28px; color: #2563eb; font-weight: bold;">
                            Total: €${presupuesto.total.toFixed(2)}
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 20px 0; font-size: 15px; text-align: center;">
                      Puede ver el presupuesto completo con todos los detalles:
                    </p>
                    
                    <!-- Botón con estilos inline -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${enlacePublico}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);">
                            📄 Ver Presupuesto Completo
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 20px 0 10px 0; font-size: 14px; color: #6b7280;">
                      Este presupuesto es válido por 30 días desde la fecha de emisión.
                    </p>
                    
                    <p style="margin: 20px 0; font-size: 14px; color: #6b7280;">
                      Si tiene alguna pregunta o necesita más información, no dude en contactarnos.
                    </p>
                    
                    <p style="margin: 30px 0 0 0; font-size: 15px;">
                      Saludos cordiales,<br>
                      <strong style="color: #2563eb;">${companyName}</strong>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 13px; color: #9ca3af;">
                      Este es un correo electrónico automático, por favor no responda a esta dirección.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Enviar correo
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: `Presupuesto #${presupuesto.numero} - ${companyName}`,
      html: htmlContent,
    });

    // Actualizar estado del presupuesto
    await prisma.presupuesto.update({
      where: { id: presupuestoId },
      data: { estado: "enviado" },
    });

    return NextResponse.json({
      message: "Presupuesto enviado correctamente",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Error al enviar el correo electrónico" },
      { status: 500 }
    );
  }
}

