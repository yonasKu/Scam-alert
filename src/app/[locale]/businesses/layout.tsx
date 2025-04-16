export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="business-layout">
      {children}
    </div>
  )
}
