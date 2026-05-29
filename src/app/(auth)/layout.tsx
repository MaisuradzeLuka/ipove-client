export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-1 flex-col">
      {children}
    </div>
  );
}
