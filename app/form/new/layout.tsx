export default function NewFormLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-screen overflow-hidden">{children}</div>
  )
}
