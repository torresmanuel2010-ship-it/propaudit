import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, phone, url } = await req.json();

    await resend.emails.send({
      from: 'PropAudit <onboarding@resend.dev>',
      to: 'torresmanuel2010@gmail.com',
      subject: `🎯 Nuevo Lead Capturado: ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #0f172a;">
          <h2 style="color: #2563eb;">¡Has recibido un nuevo lead en PropAudit!</h2>
          <p>Un cliente ha completado el formulario para ver la auditoría completa:</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Teléfono:</strong> ${phone || 'No facilitado'}</p>
          <p><strong>Web Auditada:</strong> <a href="${url}">${url}</a></p>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
