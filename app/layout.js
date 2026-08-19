export const metadata = {
  title: 'PropAudit - Auditoría Web',
  description: 'Análisis de rendimiento y SEO',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
