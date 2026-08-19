import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, phone, url } = await req.json();

    const data = await resend.emails.send({
      from: 'PropAudit <onboarding@resend.dev>',
      to: ['torresmanuel2010@gmail.com'], // Recibirás el aviso en tu correo
      subject: `Nuevo Lead Inmobiliario: ${name}`,
      html: `
        <h2>¡Nuevo cliente interesado!</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'No aportado'}</p>
        <p><strong>Web Auditada:</strong> ${url}</p>
      `,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
