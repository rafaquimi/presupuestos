import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { getConfiguracion } from "@/lib/configuracion";
import { assertSameOrigin, csrfRejected, readJsonLimited, requireApiUser, unauthorized } from "@/lib/security";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] || char);
}

export async function POST(request: Request) {
  if (!(await requireApiUser())) return unauthorized();
  if (!assertSameOrigin(request)) return csrfRejected();

  try {
    const body = await readJsonLimited(request, 20_000);
    if (!body || typeof body.presupuestoId !== "string") {
      return NextResponse.json({ error: "Solicitud no válida" }, { status: 400 });
    }
    if (process.env.EMAIL_ENABLED !== "true") {
      return NextResponse.json(
        { error: "El envío de correo está desactivado hasta renovar las credenciales SMTP" },
        { status: 503 },
      );
    }
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      return NextResponse.json({ error: "El correo SMTP no está configurado" }, { status: 503 });
    }

    const [presupuesto, configuracion] = await Promise.all([
      prisma.presupuesto.findUnique({ where: { id: body.presupuestoId }, include: { productos: true } }),
      getConfiguracion(),
    ]);
    if (!presupuesto) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    const appUrl = (process.env.APP_URL || new URL(request.url).origin).replace(/\/$/, "");
    const publicUrl = `${appUrl}/ver/${encodeURIComponent(presupuesto.publicToken)}`;
    const products = presupuesto.productos.map((p) =>
      `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(p.nombre)}</td><td style="padding:8px;text-align:right;border-bottom:1px solid #e5e7eb">${p.cantidad} × ${p.precio.toFixed(2)} €</td></tr>`,
    ).join("");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      requireTLS: process.env.SMTP_SECURE !== "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
      disableFileAccess: true,
      disableUrlAccess: true,
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: presupuesto.clienteEmail,
      subject: `Presupuesto ${presupuesto.numero} - ${configuracion.empresaNombre}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#172033"><h1 style="color:#1d4ed8">${escapeHtml(configuracion.empresaNombre)}</h1><p>Hola ${escapeHtml(presupuesto.clienteNombre)},</p><p>Te enviamos el presupuesto solicitado.</p><table style="width:100%;border-collapse:collapse">${products}</table><p style="font-size:24px;font-weight:bold;text-align:right">Total: ${presupuesto.total.toFixed(2)} €</p><p style="text-align:center;margin:30px"><a href="${publicUrl}" style="background:#1d4ed8;color:white;padding:12px 20px;border-radius:8px;text-decoration:none">Ver presupuesto</a></p></div>`,
      text: `Presupuesto ${presupuesto.numero}. Total: ${presupuesto.total.toFixed(2)} EUR. ${publicUrl}`,
    });
    await prisma.presupuesto.update({ where: { id: presupuesto.id }, data: { estado: "ENVIADO" } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error enviando presupuesto", error);
    return NextResponse.json({ error: "No se pudo enviar el correo" }, { status: 500 });
  }
}
