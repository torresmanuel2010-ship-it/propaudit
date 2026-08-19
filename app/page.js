'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Estados para la captación de leads
  const [lead, setLead] = useState({ name: '', email: '', phone: '' });
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleAudit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setIsUnlocked(false);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'No se pudo analizar la web introducida.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (lead.name && lead.email) {
      // 1. Desbloqueamos los resultados de inmediato para el usuario
      setIsUnlocked(true);

      // 2. Enviamos los datos a Resend mediante tu endpoint de la API
      try {
        await fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            url: result?.url || url
          }),
        });
      } catch (err) {
        console.error('Error al enviar el email:', err);
      }
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          body { background-color: #ffffff !important; color: #0f172a !important; }
          header, form, button, .no-print, .lead-gate { display: none !important; }
          .pdf-container { box-shadow: none !important; padding: 0 !important; margin: 0 !important; width: 100% !important; }
          .pdf-header { display: block !important; border-bottom: 3px solid #2563eb; padding-bottom: 12px; margin-bottom: 24px; }
          .blur-content { filter: none !important; pointer-events: auto !important; }
        }
      `}</style>

      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0f172a' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Header */}
          <header style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-block', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              PropAudit Pro v1.2
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 10px 0' }}>Auditoría Web Inmobiliaria</h1>
            <p style={{ color: '#64748b', fontSize: '18px', margin: '0' }}>Analiza el rendimiento, SEO y experiencia móvil de portales e inmobiliarias.</p>
          </header>

          {/* Formulario Principal */}
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '32px' }}>
            <form onSubmit={handleAudit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="url"
                placeholder="https://ejemplo-inmobiliaria.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                style={{ flex: '1', minWidth: '280px', padding: '14px 18px', fontSize: '16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#94a3b8' : '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px 28px',
                  fontSize: '16px',
                  fontWeight: '600',
                  borderRadius: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Analizando web...' : 'Generar Informe'}
              </button>
            </form>
            {error && <p style={{ color: '#ef4444', marginTop: '12px', fontSize: '14px' }}>{error}</p>}
          </div>

          {/* Resultados */}
          {result && (
            <div className="pdf-container" style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
              
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '700' }}>Informe de Auditoría</h2>
                  <a href={result.url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '14px' }}>{result.url}</a>
                </div>
                {isUnlocked && (
                  <button
                    onClick={() => window.print()}
                    className="no-print"
                    style={{ backgroundColor: '#0f172a', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    📄 Descargar PDF
                  </button>
                )}
              </div>

              {/* Vista preliminar de métricas (Siempre visible) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Rendimiento</span>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: getScoreColor(result.performanceScore), margin: '8px 0' }}>
                    {result.performanceScore} <span style={{ fontSize: '16px', color: '#94a3b8' }}>/100</span>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Optimización SEO</span>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: getScoreColor(result.seoScore), margin: '8px 0' }}>
                    {result.seoScore} <span style={{ fontSize: '16px', color: '#94a3b8' }}>/100</span>
                  </div>
                </div>
              </div>

              {/* Bloque del formulario Lead Magnet */}
              {!isUnlocked && (
                <div className="lead-gate" style={{ backgroundColor: '#1e293b', color: '#ffffff', padding: '24px', borderRadius: '12px', textAlign: 'center', margin: '20px 0' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>🔒 Desbloquea el informe completo y el PDF</h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 20px 0' }}>Introduce tus datos para acceder a las recomendaciones técnicas y descargar la auditoría.</p>
                  
                  <form onSubmit={handleUnlock} style={{ display: 'grid', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      required
                      value={lead.name}
                      onChange={(e) => setLead({ ...lead, name: e.target.value })}
                      style={{ padding: '10px 14px', borderRadius: '6px', border: 'none', outline: 'none', color: '#000' }}
                    />
                    <input
                      type="email"
                      placeholder="Tu correo electrónico"
                      required
                      value={lead.email}
                      onChange={(e) => setLead({ ...lead, email: e.target.value })}
                      style={{ padding: '10px 14px', borderRadius: '6px', border: 'none', outline: 'none', color: '#000' }}
                    />
                    <input
                      type="tel"
                      placeholder="Teléfono (Opcional)"
                      value={lead.phone}
                      onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                      style={{ padding: '10px 14px', borderRadius: '6px', border: 'none', outline: 'none', color: '#000' }}
                    />
                    <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '6px' }}>
                      Ver Informe Técnico Completo
                    </button>
                  </form>
                </div>
              )}

              {/* Contenido protegido (Desenfocado si no ha dejado sus datos) */}
              <div style={{ filter: isUnlocked ? 'none' : 'blur(5px)', opacity: isUnlocked ? 1 : 0.3, pointerEvents: isUnlocked ? 'auto' : 'none', transition: 'all 0.3s' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Checklist Técnico</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <span>Tiempo Interactivo</span>
                    <strong>{result.loadTime}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <span>Optimización de Imágenes</span>
                    <strong>{result.imageOptimization ? '✅ Correcta' : '❌ Requiere Compresión'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <span>Adaptado a Dispositivos Móviles</span>
                    <strong>{result.mobileFriendly ? '✅ Sí' : '❌ No optimizado'}</strong>
                  </div>
                </div>

                <div style={{ marginTop: '32px', backgroundColor: '#eff6ff', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #2563eb' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1e40af', fontSize: '16px' }}>💡 Diagnóstico Comercial</h4>
                  <p style={{ margin: 0, color: '#1e3a8a', fontSize: '14px', lineHeight: '1.5' }}>
                    {result.performanceScore < 50 
                      ? 'La velocidad actual de la web está provocando pérdidas de tráfico comprador. Un tiempo de carga elevado reduce hasta un 40% las solicitudes de visita en fichas de inmuebles.'
                      : 'La web cuenta con una base sólida de rendimiento, aunque se recomienda optimizar la carga de imágenes pesadas para mejorar la conversión móvil.'}
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}
