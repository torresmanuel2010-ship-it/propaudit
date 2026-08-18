import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'La URL es obligatoria' }, { status: 400 });
    }

    const apiKey = process.env.PAGESPEED_API_KEY;
    const googleApiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=PERFORMANCE&category=SEO&key=${apiKey}`;

    const response = await fetch(googleApiUrl);
    const data = await response.json();

    if (!data.lighthouseResult) {
      return NextResponse.json({ error: 'No se pudo analizar la URL proporcionada' }, { status: 400 });
    }

    const performanceScore = Math.round(data.lighthouseResult.categories.performance.score * 100);
    const seoScore = Math.round(data.lighthouseResult.categories.seo.score * 100);

    const auditData = {
      url,
      performanceScore,
      seoScore,
      loadTime: data.lighthouseResult.audits['interactive']?.displayValue || 'N/A',
      imageOptimization: data.lighthouseResult.audits['uses-optimized-images']?.score === 1,
      mobileFriendly: data.lighthouseResult.audits['viewport']?.score === 1,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: auditData });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
