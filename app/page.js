'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAudit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

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

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0f172a' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            PropAudit Pro v1.0
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 10px 0', tracking: '-0.025em' }}>Auditoría Web Inmobiliaria</h1>
          <p style={{ color: '#64748b', fontSize: '18px', margin: '0' }}>Analiza el rendimiento, SEO y experiencia móvil de portales e inmobiliarias.</p>
        </header>

        {/* Formulario */}
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
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? 'Analizando web...' : 'Generar Informe'}
            </button>
          </form>
          {error && <p style={{ color: '#ef4444', marginTop: '12px', fontSize: '14px' }}>{error}</p>}
        </div>

        {/* Resultados */}
        {result && (
          <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            
            <div style={{ borderBottom: '1px solid #e2e8f0', pb: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '700' }}>Informe de Auditoría</h2>
                <a href={result.url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '14px' }}>{result.url}</a>
              </div>
              <button onClick={() => window.print()} style={{ border: '1px solid #cbd5e1', backgroundColor: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
                🖨️ Exportar
              </button>
            </div>

            {/* Métrica Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              
              {/* Card 1 */}
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Rendimiento</span>
                <div style={{ fontSize: '32px', fontWeight: '800', color: getScoreColor(result.performanceScore), margin: '8px 0' }}>
                  {result.performanceScore} <span style={{ fontSize: '16px', color: '#94a3b8' }}>/100</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${result.performanceScore}%`, height: '100%', backgroundColor: getScoreColor(result.performanceScore) }}></div>
                </div>
              </div>

              {/* Card 2 */}
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Optimización SEO</span>
                <div style={{ fontSize: '32px', fontWeight: '800', color: getScoreColor(result.seoScore), margin: '8px 0' }}>
                  {result.seoScore} <span style={{ fontSize: '16px', color: '#94a3b8' }}>/100</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${result.seoScore}%`, height: '100%', backgroundColor: getScoreColor(result.seoScore) }}></div>
                </div>
              </div>

            </div>

            {/* Detalles Técnicos */}
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Checklist Técnico</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <span>Tiempo Interactivo</span>
                <strong>{result.loadTime}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <span>Optimización de Imágenes de Inmuebles</span>
                <strong>{result.imageOptimization ? '✅ Correcta' : '❌ Requiere Compresión'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <span>Adaptado a Dispositivos Móviles</span>
                <strong>{result.mobileFriendly ? '✅ Sí' : '❌ No optimizado'}</strong>
              </div>
            </div>

            {/* Impacto de Negocio */}
            <div style={{ marginTop: '32px', backgroundColor: '#eff6ff', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #2563eb' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#1e40af', fontSize: '16px' }}>💡 Diagnóstico Comercial</h4>
              <p style={{ margin: 0, color: '#1e3a8a', fontSize: '14px', lineHeight: '1.5' }}>
                {result.performanceScore < 50 
                  ? 'La velocidad actual de la web está provocando pérdidas de tráfico comprador. Un tiempo de carga elevado reduce hasta un 40% las solicitudes de visita en fichas de inmuebles.'
                  : 'La web cuenta con una base sólida de rendimiento, aunque se recomienda optimizar la carga de imágenes pesadas para mejorar la conversión móvil.'}
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
