export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-center min-h-screen w-full">
      {children}
    </div>
  );
}

//FirstName_LastName_AD_assign1.zip.