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
        setError(data.error || 'Error al analizar la web');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h1>PropAudit 🏢</h1>
      <p>Escáner de rendimiento y SEO para webs inmobiliarias</p>

      <form onSubmit={handleAudit} style={{ marginBottom: '20px' }}>
        <input
          type="url"
          placeholder="https://tu-inmobiliaria.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ width: '70%', padding: '10px', fontSize: '16px', marginRight: '10px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          {loading ? 'Analizando...' : 'Auditar Web'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h2>Resultados para: {result.url}</h2>
          <p><strong>Puntuación Rendimiento:</strong> {result.performanceScore} / 100</p>
          <p><strong>Puntuación SEO:</strong> {result.seoScore} / 100</p>
          <p><strong>Tiempo de carga:</strong> {result.loadTime}</p>
          <p><strong>Optimización de Imágenes:</strong> {result.imageOptimization ? '✅ Sí' : '❌ Requiere mejora'}</p>
          <p><strong>Adaptado a Móviles:</strong> {result.mobileFriendly ? '✅ Sí' : '❌ No'}</p>
        </div>
      )}
    </main>
  );
}
