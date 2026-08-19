'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

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
      setIsUnlocked(true);
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

  const getScoreBadge = (score) => {
    if (score >= 90) return { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0', label: 'Excelente' };
    if (score >= 50) return { bg: '#fef3c7', color: '#b45309', border: '#fde68a', label: 'Mejorable' };
    return { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca', label: 'Crítico' };
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          body { background-color: #ffffff !important; color: #0f172a !important; }
          header, form, button, .no-print, .lead-gate, nav, footer { display: none !important; }
          .pdf-container { box-shadow: none !important; padding: 0 !important; border: none !important; }
          .blur-content { filter: none !important; opacity: 1 !important; pointer-events: auto !important; }
        }
      `}</style>

      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#0f172a' }}>
        
        {/* Barra de Navegación */}
        <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '20px', color: '#0f172a' }}>
            <span style={{ backgroundColor: '#2563eb', color: '#fff', padding: '6px 10px', borderRadius: '8px', fontSize: '16px' }}>📊</span> InmoMetrics <span style={{ fontSize: '12px', color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>PRO</span>
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
            🔒 Diagnóstico de Rendimiento Inmobiliario
          </div>
        </nav>

        <div style={{ maxWidth: '850px', margin: '0 auto', padding: '50px 20px' }}>
          
          {/* Header */}
          <header style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ display: 'inline-block', backgroundColor: '#eff6ff', color: '#2563eb', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', border: '1px solid #dbeafe' }}>
              Plataforma de Auditoría Técnica
            </span>
            <h1 style={{ fontSize: '40px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0', letterSpacing: '-1px', lineHeight: '1.2' }}>
              Auditoría Web & SEO para Inmobiliarias
            </h1>
            <p style={{ color: '#475569', fontSize: '18px', margin: '0 auto', maxWidth: '600px', lineHeight: '1.6' }}>
              Analiza la velocidad de tus fichas de inmuebles y detecta fallos que frenan la captación de compradores.
            </p>
          </header>

          {/* Formulario Principal */}
          <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05)', border: '1px solid #e2e8f0', marginBottom: '40px' }}>
            <form onSubmit={handleAudit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="url"
                placeholder="https://tu-inmobiliaria.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                style={{ flex: '1', minWidth: '280px', padding: '16px 20px', fontSize: '16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#f8fafc' }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#94a3b8' : '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '700',
                  borderRadius: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                }}
              >
                {loading ? 'Analizando Portal...' : 'Analizar Ahora'}
              </button>
            </form>
            {error && <p style={{ color: '#dc2626', marginTop: '14px', fontSize: '14px', fontWeight: '500' }}>⚠️ {error}</p>}
          </div>

          {/* Resultados */}
          {result && (
            <div className="pdf-container" style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
              
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '24px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>Informe InmoMetrics para</span>
                  <h2 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{result.url}</h2>
                </div>
                {isUnlocked && (
                  <button
                    onClick={() => window.print()}
                    className="no-print"
                    style={{ backgroundColor: '#0f172a', color: '#ffffff', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                  >
                    📥 Descargar Informe PDF
                  </button>
                )}
              </div>

              {/* Cards Métricas */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '36px' }}>
                {[{ title: 'Rendimiento Técnico', score: result.performanceScore }, { title: 'Optimización SEO', score: result.seoScore }].map((item, idx) => {
                  const badge = getScoreBadge(item.score);
                  return (
                    <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '14px', color: '#475569', fontWeight: '600' }}>{item.title}</span>
                        <span style={{ backgroundColor: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                          {badge.label}
                        </span>
                      </div>
                      <div style={{ fontSize: '38px', fontWeight: '800', color: '#0f172a' }}>
                        {item.score} <span style={{ fontSize: '18px', color: '#94a3b8', fontWeight: '500' }}>/100</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lead Magnet Gate */}
              {!isUnlocked && (
                <div className="lead-gate" style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '36px', borderRadius: '16px', textAlign: 'center', margin: '24px 0' }}>
                  <div style={{ display: 'inline-block', backgroundColor: '#1e293b', padding: '8px 14px', borderRadius: '30px', fontSize: '13px', fontWeight: '600', color: '#60a5fa', marginBottom: '16px' }}>
                    🔒 Informe Completo Bloqueado
                  </div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: '700' }}>Accede a las Recomendaciones Técnicas</h3>
                  <p style={{ color: '#94a3b8', fontSize: '15px', margin: '0 0 24px 0', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                    Introduce tus datos para desbloquear el desglose de tiempo de carga y descargar el documento en PDF.
                  </p>
                  
                  <form onSubmit={handleUnlock} style={{ display: 'grid', gap: '12px', maxWidth: '420px', margin: '0 auto' }}>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      required
                      value={lead.name}
                      onChange={(e) => setLead({ ...lead, name: e.target.value })}
                      style={{ padding: '14px 16px', borderRadius: '8px', border: '1px solid #334155', outline: 'none', backgroundColor: '#1e293b', color: '#fff', fontSize: '15px' }}
                    />
                    <input
                      type="email"
                      placeholder="Correo profesional"
                      required
                      value={lead.email}
                      onChange={(e) => setLead({ ...lead, email: e.target.value })}
                      style={{ padding: '14px 16px', borderRadius: '8px', border: '1px solid #334155', outline: 'none', backgroundColor: '#1e293b', color: '#fff', fontSize: '15px' }}
                    />
                    <input
                      type="tel"
                      placeholder="Teléfono (Opcional)"
                      value={lead.phone}
                      onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                      style={{ padding: '14px 16px', borderRadius: '8px', border: '1px solid #334155', outline: 'none', backgroundColor: '#1e293b', color: '#fff', fontSize: '15px' }}
                    />
                    <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '16px', borderRadius: '8px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', marginTop: '8px' }}>
                      Ver Informe Técnico e Imprimir PDF
                    </button>
                  </form>
                </div>
              )}

              {/* Contenido Protegido */}
              <div style={{ filter: isUnlocked ? 'none' : 'blur(6px)', opacity: isUnlocked ? 1 : 0.25, pointerEvents: isUnlocked ? 'auto' : 'none', transition: 'all 0.4s ease' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#0f172a' }}>Checklist Técnico</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                    <span style={{ fontWeight: '500', color: '#334155' }}>Tiempo de Respuesta Interactivo</span>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>{result.loadTime}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                    <span style={{ fontWeight: '500', color: '#334155' }}>Compresión de Imágenes de Inmuebles</span>
                    <span style={{ fontWeight: '700', color: result.imageOptimization ? '#16a34a' : '#dc2626' }}>
                      {result.imageOptimization ? '✅ Sin problemas detectados' : '❌ Requiere Optimización'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                    <span style={{ fontWeight: '500', color: '#334155' }}>Adaptabilidad Móvil</span>
                    <span style={{ fontWeight: '700', color: result.mobileFriendly ? '#16a34a' : '#dc2626' }}>
                      {result.mobileFriendly ? '✅ Correcta' : '❌ Versión móvil no optimizada'}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '32px', backgroundColor: '#eff6ff', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #2563eb' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1e40af', fontSize: '16px', fontWeight: '700' }}>💡 Diagnóstico Comercial</h4>
                  <p style={{ margin: 0, color: '#1e3a8a', fontSize: '15px', lineHeight: '1.6' }}>
                    {result.performanceScore < 50 
                      ? 'La velocidad actual del portal está penalizando el posicionamiento en Google y aumentando la tasa de abandono en móviles.'
                      : 'El portal cuenta con una base sólida de rendimiento. Se recomienda optimizar la compresión de imágenes pesadas.'}
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        <footer style={{ borderTop: '1px solid #e2e8f0', padding: '30px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px', marginTop: '60px' }}>
          InmoMetrics © 2026 — Plataforma de Auditoría de Portales Inmobiliarios.
        </footer>

      </div>
    </>
  );
}
